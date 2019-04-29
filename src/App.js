import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import firebase from './Firebase';
import TopBar from './components/TopBar';
import Grafica from './components/Grafica';
import { savePDF } from '@progress/kendo-react-pdf';
import { Button } from '@progress/kendo-react-buttons';
import { runInThisContext } from 'vm';


class App extends Component {
  constructor(props) {
    super(props);
    
    this.appContainer = React.createRef();
    this.mostrarFiltros = this.mostrarFiltros.bind(this)
    this.contarRepetidos = this.contarRepetidos.bind(this)
    this.distribucionEdadNino = this.distribucionEdadNino.bind(this)
    this.distribucionSexoNino = this.distribucionSexoNino.bind(this)
    this.distribucionAlturaNino = this.distribucionAlturaNino.bind(this)
    this.distribucionPesoNino = this.distribucionPesoNino.bind(this)
    this.distribucionEdad = this.distribucionEdad.bind(this)
    this.distribucionSexo = this.distribucionSexo.bind(this)
    this.distribucionEPS = this.distribucionEPS.bind(this);
    this.distribucionEstrato = this.distribucionEstrato.bind(this);
    this.distribucionNumeroHijos = this.distribucionNumeroHijos.bind(this);
    this.filtrarTutotes = this.filtrarTutotes.bind(this);
    this.filtroSexoYNumeroHijos = this.filtroSexoYNumeroHijos.bind(this);
    this.cambiarFiltro = this.cambiarFiltro.bind(this)
    this.handleChangeFilter = this.handleChangeFilter.bind(this)
    this.handleChangeFilterNino = this.handleChangeFilterNino.bind(this)
    this.darNumeroPrimerizos = this.darNumeroPrimerizos.bind(this)
    this.darConTodosSusHijos = this.darConTodosSusHijos.bind(this)
    this.darNumeroActivos = this.darNumeroActivos.bind(this)
    this.darHijos = this.darHijos.bind(this)
    this.edadPromedioNinos = this.edadPromedioNinos.bind(this)
    this.edadPromedioTutores = this.edadPromedioTutores.bind(this)

    this.ref = firebase.firestore().collection('tutores');
    this.unsubscribe = null;
    this.state = { 
      hijos:[],   
      tutores: [],
      idsTutores:[],
      etiquetas:[],
      colores:[],
      datos:[],
      chartData:{
        labels:[],
        datasets:[
          {
            label:"",
            data:[],
            backgroundColor:[],
          }
        ]
        
      },
      numeroTutores: 0,
      titulo:"",
      filtro:""
    };

  }

  getChartData(){
    return this.state.chartData;
  }

  handlePDFExport = () => {
    savePDF(ReactDOM.findDOMNode(this.appContainer), { paperSize: 'auto' });
  }

  onCollectionUpdate = (querySnapshot) => {
    const tutores = [];
    const idsTutores = []
    querySnapshot.forEach((doc) => {
      let { correo, eps, sexo, nombre, estrato, edad, numeroHijos,ultimaActualizacion } = doc.data();
        this.darHijos(doc.id);
        tutores.push({
        key: doc.id,
        doc, // DocumentSnapshot
        correo, 
        eps, 
        sexo,
        nombre,
        estrato,
        edad,
        numeroHijos,
        ultimaActualizacion
      });
    });
    this.setState({
      idsTutores,
      tutores,
      numeroTutores:tutores.length
   });

   this.setState({ 
        numeroPrimerizos:this.darNumeroPrimerizos()//,
        //numeroActivos:this.darNumeroActivos()
   });
      //console.log("TUTORES", this.state.hijos)
      console.log("HIJOS", this.state.hijos)
  }


  darHijos(padre){
    var hijosRef = firebase.firestore().collection('tutores').doc(padre).collection('hijos');
    let hijos = [];
    hijos = this.state.hijos;
    return hijosRef.get()
        .then(snapshot => {
            snapshot.forEach(item => {
              let { altura, compartido, fechaNacimiento, nombre, edad, peso, sexo } = item.data();
              hijos.push({
                  key: item.id,
                  altura,
                  compartido,
                  fechaNacimiento,
                  nombre,
                  edad,
                  peso,
                  sexo,
                  padre
                });
            });
            this.setState({
              hijos,
              totalNinos: hijos.length
          });
        })
    } 
          

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    this.getChartData();
  }

  componentWillMount(){
    this.getChartData();
  }

  getChartData(){
    // Ajax calls here
    this.setState({
      chartData:{
        labels: this.state.etiquetas,
        datasets:[
          {
            label: this.state.titulo,
            data:this.state.datos,
            backgroundColor:this.state.colores
          }
        ]
      }
    });
  }

  /* Datos puntuales */

  darNumeroActivos(){
    let cont =0;
    let d = new Date();
    //console.log("d", d);
    let n = new Date();
    n.setMonth(d.getMonth()-1);
    //console.log("n", n);

    let fechaTutor;
    let s= "";
    for(let i=0; i < this.state.tutores.length; i++){
      s=""+this.state.tutores[i].ultimaActualizacion

      fechaTutor = new Date(s)

        if (fechaTutor> n && fechaTutor< d)
        {
          cont++;
        }
    }

    return cont;
}

  darNumeroPrimerizos(){
      let cont =0;
      for(let i=0; i < this.state.tutores.length; i++){
          if(this.state.tutores[i].numeroHijos === "1" || this.state.tutores[i].numeroHijos === 1)
          {
            cont++;
          }
      }

      return cont;
  }

  darConTodosSusHijos(){
    let cont =0;
    for(let i=0; i < this.state.tutores.length; i++){
        if(parseInt(this.state.tutores[i].numeroHijos) === this.darNumeroHijos(this.state.tutores[i].correo))
        {
          cont++;
        }
    }

    return cont;
}

darNumeroHijos(padre){
  let cont =0;
//while(this.state.hijos.length>0){
  for(let i=0; i < this.state.hijos.length; i++){
      if(this.state.hijos[i].padre === padre)
      {
        cont++;
      }
  }
//}
  return cont;
}


edadPromedioTutores(){
  let cont =0;
  for(let i=0; i < this.state.tutores.length; i++){
        cont+=this.state.tutores[i].edad;
  }

  return Math.trunc(cont/this.state.tutores.length);          
}

edadPromedioNinos(){
  let cont =0;
  for(let i=0; i < this.state.hijos.length; i++){
        cont+=this.state.hijos[i].edad;
  }

  return Math.trunc(cont/this.state.hijos.length);                
}


/* Distribuciones */

  contarRepetidos(datos, propiedad) {
    return datos
      .reduce((res, item) => Object
        .assign(res, {
          [item[propiedad]]: 1 + (res[item[propiedad]] || 0)
        }), Object.create(null));
  }

  distribucionEdad(){
      return  this.contarRepetidos( this.state.tutores,'edad');
  }

  distribucionSexo(){
    return this.contarRepetidos(this.state.tutores,'sexo');
  }

  distribucionEdadNino(){
    console.log(this.contarRepetidos( this.state.hijos,'edad'));
    return  this.contarRepetidos( this.state.hijos,'edad');
  }

  distribucionSexoNino(){
    return this.contarRepetidos(this.state.hijos,'sexo');
  }

  distribucionAlturaNino(){
    return this.contarRepetidos(this.state.hijos,'altura');
  }

  distribucionPesoNino(){
    return this.contarRepetidos(this.state.hijos,'peso');
  }


distribucionEstrato(){
    return this.contarRepetidos(this.state.tutores,'estrato');
}

distribucionNumeroHijos(){
  return this.contarRepetidos(this.state.tutores,'numeroHijos');
}

distribucionEPS(){
  return this.contarRepetidos(this.state.tutores,'eps');
}

distribucionEdadHombres(){
    return this.contarRepetidos(this.filtrarTutotes( this.state.tutores,{sexo:0}),'edad');
}

distribucionEdadMujeres(){
  return this.contarRepetidos(this.filtrarTutotes( this.state.tutores,{sexo:1}),'edad');
}

distribucionPesoNinosH(){
  return this.contarRepetidos(this.filtrarTutotes( this.state.hijos,{sexo:0}),'peso');
}

distribucionPesoNinasM(){
return this.contarRepetidos(this.filtrarTutotes( this.state.hijos,{sexo:1}),'peso');
}


/* Filtros múltiples */

filtroSexoYNumeroHijos(pSexo, pNumeroHijos){
        if (this.filtrarTutotes( this.state.tutores,{sexo:pSexo, numeroHijos:pNumeroHijos})===undefined) {
            //error
        }
        return this.filtrarTutotes( this.state.tutores,{sexo:pSexo, numeroHijos:pNumeroHijos});
}

filtrarTutotes(datos, propiedad){

  return datos.filter(function(obj) {
    return Object.keys(propiedad).every(function(c) {
      return obj[c] == propiedad[c];
    });
  });

}

  /* */

  llenarColores(tam){
    let coloresRandom = [];

    var o = Math.round, r = Math.random, s = 240;
    for(let i=0; i < tam; i++){
      coloresRandom.push('rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')');
    }
    return coloresRandom;
  }

  llenarColoresRosados(tam){
    let coloresRandom = [];
    for(let i=0; i < tam; i++){
      coloresRandom.push('rgba(255, 99, 132, 0.6)');
    }
    return coloresRandom;
  }

  llenarColoresAzules(tam){
    let coloresRandom = [];
    for(let i=0; i < tam; i++){
      coloresRandom.push('rgba(54, 162, 235, 0.6)');
    }
    return coloresRandom;
  }

  handleChangeFilter(event) {
    let selected = event.target.value
    this.cambiarFiltro(selected);
  }


  cambiarFiltro(filtro)
  {
    let titulo = filtro;
    if(filtro === "sexo"){
      titulo =" sexo (Tutores)"
      this.state.etiquetas = Object.keys(this.distribucionSexo());
      this.state.datos = Object.values(this.distribucionSexo())
      this.state.colores =['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)']
    }

   else if(filtro === "edad"){
    titulo =" edad (Tutores)"
      this.state.etiquetas = Object.keys(this.distribucionEdad());
      this.state.datos = Object.values(this.distribucionEdad());
      this.state.colores = this.llenarColores(this.state.etiquetas.length);
    }

    else if(filtro === "numeroHijos"){
      titulo="número de hijos";
        this.state.etiquetas = Object.keys(this.distribucionNumeroHijos());
        this.state.datos = Object.values(this.distribucionNumeroHijos());
        this.state.colores = this.llenarColores(this.state.etiquetas.length);
    }

    else if(filtro === "estrato"){
      titulo =" estrato (Tutores)"
      this.state.etiquetas = Object.keys(this.distribucionEstrato());
      this.state.datos = Object.values(this.distribucionEstrato());
      this.state.colores = this.llenarColores(this.state.etiquetas.length);
    }

    else if(filtro === "eps"){
      titulo =" peso (Tutores)"
      this.state.etiquetas = Object.keys(this.distribucionEPS());
      this.state.datos = Object.values(this.distribucionEPS());
      this.state.colores = this.llenarColores(this.state.etiquetas.length);
    }
    else if(filtro === "edadH"){
      titulo="Hombres por edad (Tutores)";
      this.state.etiquetas = Object.keys(this.distribucionEdadHombres());
      this.state.datos = Object.values(this.distribucionEdadHombres());
      this.state.colores =this.llenarColoresAzules(this.state.etiquetas.length);
    }

    else if(filtro === "edadM"){
      titulo="Mujeres por edad (Tutores)";
      this.state.etiquetas = Object.keys(this.distribucionEdadMujeres());
      this.state.datos = Object.values(this.distribucionEdadMujeres());
      this.state.colores =this.llenarColoresRosados(this.state.etiquetas.length);

  }
  

   let charDataCopy = this.state.chartData
     charDataCopy.datasets[0].data = this.state.datos
     charDataCopy.datasets[0].backgroundColor = this.state.colores
     charDataCopy.labels = this.state.etiquetas
     
     this.setState(
       {
         titulo,
         filtro,
         chartData:charDataCopy
       }
     );

     return charDataCopy;
  }


  handleChangeFilterNino(event) {
    let filtro = event.target.value
    let titulo = event.target.value
    if(filtro === "sexo"){
      titulo =" sexo (Niños)"
      this.state.etiquetas = Object.keys(this.distribucionSexoNino());
      this.state.datos = Object.values(this.distribucionSexoNino());
      this.state.colores =['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)']
    }

   else if(filtro === "edad"){
    titulo =" edad (Niños)"
      this.state.etiquetas = Object.keys(this.distribucionEdadNino());
      this.state.datos = Object.values(this.distribucionEdadNino());
      this.state.colores = this.llenarColores(this.state.etiquetas.length);
    }

    else if(filtro === "altura"){
      titulo =" altura (Niños)"
      this.state.etiquetas = Object.keys(this.distribucionAlturaNino());
      this.state.datos = Object.values(this.distribucionAlturaNino());
      this.state.colores = this.llenarColores(this.state.etiquetas.length)
    }

    else if(filtro === "peso"){
      titulo =" peso (Niños)"
      this.state.etiquetas = Object.keys(this.distribucionPesoNino());
      this.state.datos = Object.values(this.distribucionPesoNino());
      this.state.colores = this.llenarColores(this.state.etiquetas.length);
    }

    else if(filtro === "pesoH"){
      titulo="Peso para niños (Sexo: Hombre)";
      this.state.etiquetas = Object.keys(this.distribucionPesoNinosH());
      this.state.datos = Object.values(this.distribucionPesoNinosH());
      this.state.colores =this.llenarColoresAzules(this.state.etiquetas.length);
    }

    else if(filtro === "pesoM"){
      titulo="Peso para niñas (Sexo: Mujer)";
      this.state.etiquetas = Object.keys(this.distribucionPesoNinasM());
      this.state.datos = Object.values(this.distribucionPesoNinasM());
      this.state.colores =this.llenarColoresRosados(this.state.etiquetas.length);
    }

   let charDataCopy = this.state.chartData
     charDataCopy.datasets[0].data = this.state.datos
     charDataCopy.datasets[0].backgroundColor = this.state.colores
     charDataCopy.labels = this.state.etiquetas
     
     this.setState(
       {
         titulo,
         filtro,
         chartData:charDataCopy
       }
     );
  }

  mostrarFiltros(){
    return (
      <div>
            <div className="form-group">
                <label htmlFor="filtrosTutores">
                <h5><b>Filtros:</b></h5>
                <h6>Tutores:</h6>
                </label>
                <select
                className="form-control"
                value={this.state.filtro}
                onChange={this.handleChangeFilter} >
                <option value="edad">Edad</option>
                <option value="sexo">Sexo</option>
                <option value="eps">EPS</option>
                <option value="estrato">Estrato</option>
                <option value="numeroHijos">Número de hijos</option>
                <option value="edadH">Edad (hombres)</option>
                <option value="edadM">Edad (mujeres)</option>

                </select>
            </div>
            <div className="form-group">
                <label htmlFor="filtrosNinos">
                <h6>Niños:</h6>
                </label>
                <select
                className="form-control"
                value={this.state.filtro}
                onChange={this.handleChangeFilterNino} >
                <option value="peso">Peso</option>
                <option value="edad">Edad</option>
                <option value="sexo">Sexo</option>
                <option value="altura">Altura</option>
                <option value="pesoH">Peso (niños)</option>
                <option value="pesoM">Peso (niñas)</option>
                </select>
            </div>
        </div>
  );
  }


  verEdadesPromedio(){
    return true;
  }
  mostrarEdadesPromedio(){
    return (
    <div className="row">
      <div className="col-6" align="center">
      <h6 className="m-b-15"  align="center">Edad promedio (niños)</h6>
          <div className="round bg-c-bl order-card" >
              <div className="round-block">
                  <h2 className="text-center" ><span>{this.edadPromedioNinos()}</span></h2>
                  <h6 className="m-b-15"  align="center">meses</h6>
              </div>
          </div>
      </div>
      <div className="col-6"  align="center">
      <h6 className="m-b-15"  align="center">Edad promedio (tutores)</h6>
          <div className="round bg-c-bl order-card">
          <div className="round-block">
                  <h2 className="text-center" ><span>{this.edadPromedioTutores()}</span></h2>
                  <h6 className="m-b-15"  align="center">años</h6>
              </div>
          </div>
      </div>    
      </div>                    
    );
  }

  render() {
    return (
        <div>
          <div className="bg-c-blue shadow text-light" >
            <br />
            <h1 className="text-center"><b>BHelp</b></h1>
            <h5 className="text-center raleway">          
                  Dashboard               
              <br />
              <br />
              <br />
            </h5>
          </div>
          <div className="container container-fluid mb-5">
          <div align="right">
          <br />
          <Button onClick={this.handlePDFExport} className="btn btn-secondary mr-2 mb-2"><i className="far fa-edit"></i>&nbsp;Exportar como PDF</Button>
          </div>
          <div className="row" ref={(el) => this.appContainer = el}>
                <TopBar 
                numeroTutores={ this.state.numeroTutores} 
                numeroPrimerizos={this.state.numeroPrimerizos} 
                conTodosSusHijos={this.darConTodosSusHijos()} 
                totalNinos={this.state.totalNinos} 
                numeroActivos={this.darNumeroActivos()}/>
 
                <div className="container">
                  <div className="row">
                  <div className="col-2">
                        {this.mostrarFiltros()}
                        <br/>
                    </div>
                    <div className="col-10">
                      <Grafica chartData={this.state.chartData} titulo={this.state.titulo} legendPosition="bottom"/>
                      <center>
                        <br/>
                        <br/>
                        {this.mostrarEdadesPromedio()}
                      </center>
                    </div>
                </div>
              {/* <ListaUsuarios tutores={this.state.tutores}/> */}
              </div>

            </div>
          </div>
      </div>
    );
  }
}

export default App;
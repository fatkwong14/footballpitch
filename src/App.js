import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Input, ListGroup, ListGroupItem } from 'reactstrap';
import GoogleMapReact, { GoogleApiWrapper } from 'google-map-react';
import { Flex, Box } from 'reflexbox';
import data from './facility-hssp7';


function formatName(user) {
  if(user)  {
    return user.firstName + ' ' + user.lastName;
  }
    return 'stranger';

}

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class SimpleMap extends React.Component {

  constructor(props){
    super(props);
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     center:{
  //       lat: nextProps.lat,
  //       lng: nextProps.lng,
  //   }
  //   });
  // }

  // static defaultProps = {
  //   // center: {lat: 59.95, lng: 30.33},
  //   center: {lat: 70.95, lng: 50.33},
  //   zoom: 11
  // };

  render() {
    return (
      <div style={{width: '100%', height: '300px'}}>
      <GoogleMapReact
        center={this.props.center}
        // defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
        bootstrapURLKeys={{
         key: 'AIzaSyBHVk8wgvJEvWbmbsuggXtoEvp8-qinP6s',
         // language: 'en'
         language: 'zh_TW'
       }}
      >

        <AnyReactComponent
          lat={this.props.center.lat}
          lng={this.props.center.lng}
          text={this.props.cname}
          // text={'Kreyser Avrora'}
        />
      </GoogleMapReact>
      </div>
    );
  }
}

class Element extends React.Component {
  render() {
    return (
      <div>
          <h1>Hello, {formatName(this.props.user)}!</h1>
        </div>
    );
  }
}

class Clock extends React.Component {
  constructor(props) {
     super(props);
     this.state = {date: new Date()};
   }

   componentDidMount() {
     this.timerID = setInterval(
           () => this.tick(),
           1000
         );
    }

 componentWillUnmount() {
   clearInterval(this.timerID);
 }

 tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1> Component Clock is produced ! {this.props.author} </h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

class FootballPitch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchText:'',
      pitch: data,
      filteredList: data,
      center:{
        lat:0,
        lng:0,
      }
      // pitch: [],
      // filteredList: [],
    };
    console.log(this.state.pitch);
  }

  getFootballPitch(){
    console.log('url '+this.props.url);
    var url = this.props.url;
    // var url = 'http://www.lcsd.gov.hk/datagovhk/facility/facility-sp7atp.json'

    fetch(url)
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(data => {
      // that.setState({ person: data.person });
      console.log(data);
      this.setState({
        pitch: data,
        filteredList: data
      });
      console.log(this.state.pitch);
      console.log(this.state.pitch[0].Address_en);
    });
  }

  componentDidMount(){
    //use local json instead
     // this.getFootballPitch();
  }

  componentWillUnmount() {
  }

  filterObjList(event){
    this.setState({searchText: event.target.value.toUpperCase()});
    var updatedList = this.state.pitch;
    updatedList = updatedList.filter(function(item){
      //originally search by Name_cn only
      // return item.Name_cn.toLowerCase().search(
      //   event.target.value.toLowerCase()) !== -1;

//two criterias : name or district matches
      return (item.Name_cn.toLowerCase().search(
          event.target.value.toLowerCase()) !== -1) ||
          (item.District_cn.toLowerCase().search(
              event.target.value.toLowerCase()) !== -1) ;
    });
    this.setState({filteredList: updatedList});
  }

  onItemClick(item, e) {
    console.log(item.Name_cn);
    console.log(item.Latitude);
    console.log(item.Longitude);

    if(item.Latitude==null)
      return {lat:0,lng:0};

    let lat = item.Latitude.split('-');
    let lng = item.Longitude.split('-');

    var intLat0 = parseFloat(lat[0]);
    var intLat1 = parseFloat(lat[1]/60);
    var intLat2 = parseFloat(lat[2]/3600);

    var fLng0 = parseFloat(lng[0]);
    var fLng1 = parseFloat(lng[1]/60);
    var fLng2 = parseFloat(lng[2]/3600);

    let latFinal = intLat0 + intLat1 + intLat2;
    let lngFinal = fLng0 + fLng1 + fLng2;

    console.log('final lat '+latFinal);
    console.log('final lng '+lngFinal);

    // const newState = {lat:59.95,lng:30.33};
    const newState = {lat:latFinal,lng:lngFinal};
    console.log(newState);
    this.props.callbackParent(newState, item.Name_cn); // we notify our parent
    //var newState = {center:{lat:59.95,lng:30.33}};
    // this.props.callbackParent({center:{lat:59.95,lng:30.33}}); // we notify our parent
}

// onTextChanged: function() {
//     var newState = !this.state.checked;
//     this.setState({ checked: newState }); // we update our state
//
//   },



  render(){

    const listItems = this.state.filteredList.map((d) =>{
      let boundItemClick = this.onItemClick.bind(this, d);
      // return <li
      //         onClick={boundItemClick}
      //         key={d.Address_en}>{d.District_cn}-{d.Name_cn}</li>
      return <ListGroupItem
              onClick={boundItemClick}
              key={d.Address_en}>{d.District_cn}-{d.Name_cn}</ListGroupItem>
    });

    /*
        <nav><ul>
        {listItems }
        </ul></nav>

    */

    return(
      <div>
      <Input type="text"
       placeholder="Search"
       value={this.state.searchText} onChange={this.filterObjList.bind(this)} />
       <nav>
      <ListGroup>
      {listItems }
      </ListGroup>
      </nav>
      </div>
    );
  }
}

function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
      <ul>
      <li>https://reactstrap.github.io/</li>
      <li>https://ant.design</li>
      </ul>
    </div>
  );
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};
//inject self designed comp. by {myComp}
/*
const element = (
  <div>
      <h1>Hello, {formatName(user)}!</h1>
      {datetime()}
    </div>
);
*/

function ProductList(props) {
  // const productList = props.productList;

    const productList = props.productList.map((d) =>
      <li key={d.id}>{d.name}</li>
    );

    return(
      <div>
      {productList }
      </div>
    );
  }


class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      isFilter: false,
      allList: [
        {
          id: 0,
          name: 'Jonny Strömberg',
          born: 1986
        },
        {
          id: 1,
          name: 'Jonas Arnklint',
          born: 1985
        },
        {
          id: 2,
          name: 'Martina Elm',
          born: 1986
        }
      ],
      filteredList : [],
    };
    this.textChange = this.textChange.bind(this);
  }

  componentWillMount(){
    this.setState({filteredList: this.state.allList});
  }

  textChange(event) {
    this.setState({searchText: event.target.value.toUpperCase()});
    console.log('searchText '+this.state.searchText);
  }

  filterObjList(event){
    this.setState({searchText: event.target.value.toUpperCase()});
    var updatedList = this.state.allList;
    updatedList = updatedList.filter(function(item){
      return item.name.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.setState({filteredList: updatedList});
  }

    render(){
      return (
        <div>
        <input type="text" value={this.state.searchText} onChange={this.filterObjList.bind(this)} />
        <ProductList productList={this.state.filteredList} />
        </div>
      );
    }
}


const messages = ['React', 'Re: React', 'Re:Re: React'];


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pitch: [],
      filteredPitch:[],
      center:{
        // lat: 59.95, lng: 30.33,
        lat: 60.95,
        lng: 33.33,
      },
      cname: ''
    };

    // this.getFootballPitch = this.getFootballPitch.bind(this);
  }

  getFootballPitch(){
    var url = 'http://www.lcsd.gov.hk/datagovhk/facility/facility-sp7atp.json'
    fetch(url)
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      console.log('ssss '+response);
      return response.json();
    })
    .then(data => {
      // that.setState({ person: data.person });
      console.log(data);
      this.setState({
        pitch: data
      });
      console.log(this.state.pitch);
      console.log(this.state.pitch[0].Address_en);
    });
  }

  componentDidMount(){
    // this.getFootballPitch();
  }

  componentWillUnmount() {
  }

  onChildChanged(newState, b) {
    console.log('outside');
    console.log(newState);
    console.log(b);
       this.setState({center:newState});
       this.setState({cname:b});

       // this.setState({center:{lat:59.95,lng:30.33}});
     }

  render(){
    return(
      <Flex wrap p={1} w={1} align='center'>
              <Box p={1} w={1}>
                <FootballPitch url='https://www.lcsd.gov.hk/datagovhk/facility/facility-hssp7.json'
                callbackParent={(newState, b) => this.onChildChanged(newState, b) }
                />
              </Box>
              <Box p={1} w={1}>
                <SimpleMap
                  cname={this.state.cname}
                  center={this.state.center} zoom={18}/>
              </Box>
      </Flex>
      /*
      <Flex p={4} align='center'>
              <Box px={1} w={1/3}>
                <FootballPitch url='https://www.lcsd.gov.hk/datagovhk/facility/facility-hssp7.json'
                callbackParent={(newState, b) => this.onChildChanged(newState, b) }
                />
                <Button color="danger" onClick={()=>{
                  this.setState({center:{lat:59.95,lng:30.33}});
                  console.log(this.state.center);
                  //59.95, lng: 30.33
                }}>Danger!</Button>
              </Box>
              <Box px={2} w={2/3}>
                <SimpleMap
                  cname={this.state.cname}
                  center={this.state.center} zoom={18}/>
              </Box>
      </Flex>
      */
    );
  }
  /*
  render() {
    return (
      <div className="App">

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcweome to React, eventually</h1>
        </header>
        <Clock author='by jason'/>
        <Element user={user} />
        <Toggle />
        <FootballPitch url='https://www.lcsd.gov.hk/datagovhk/facility/facility-hssp7.json'/>
        <Mailbox unreadMessages={messages} />
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p>p without styling</p>
        <hr />

        <h1> TODO list </h1>
        <SearchBar />
        <SimpleMap />
      </div>
    );
  }
  */
}

export default App;

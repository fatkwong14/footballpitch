import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'reactstrap';
import GoogleMapReact, { GoogleApiWrapper } from 'google-map-react';
import { Flex, Box } from 'reflexbox';

function formatName(user) {
  if(user)  {
    return user.firstName + ' ' + user.lastName;
  }
    return 'stranger';

}

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class SimpleMap extends React.Component {
  static defaultProps = {
    center: {lat: 59.95, lng: 30.33},
    zoom: 11
  };

  render() {
    return (
      <div style={{textAlign:'right', width: '100%', height: '400px'}}>
      <GoogleMapReact
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
        bootstrapURLKeys={{
         key: 'AIzaSyBHVk8wgvJEvWbmbsuggXtoEvp8-qinP6s',
         language: 'en'
       }}
      >
        <AnyReactComponent
          lat={59.955413}
          lng={30.337844}
          text={'Kreyser Avrora'}
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
      pitch: [],
      filteredList: [],
    };

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
    this.getFootballPitch();
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
}


  render(){

    const listItems = this.state.filteredList.map((d) =>{
      let boundItemClick = this.onItemClick.bind(this, d);
      return <li
              onClick={boundItemClick}
              key={d.Address_en}>{d.District_cn}-{d.Name_cn}</li>
    });

    return(
      <div>
      <input type="text" value={this.state.searchText} onChange={this.filterObjList.bind(this)} />
      <nav><ul>
      {listItems }
      </ul></nav>
      <Button color="danger">Danger!</Button>
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
      filteredPitch:[]
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

  render(){
    return(
      <Flex p={4} align='center'>
              <Box px={1} w={1/4}>
                <FootballPitch url='https://www.lcsd.gov.hk/datagovhk/facility/facility-hssp7.json'/>
              </Box>
              <Box px={3} w={3/4}>
                <SimpleMap />
              </Box>
      </Flex>
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

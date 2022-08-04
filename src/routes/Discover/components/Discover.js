import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import '../styles/_discover.scss';
import { getAuth } from '../../../axios';
import axios from 'axios';

// const fetchSongs = async() => {
//   const token = await getAuth();

//   // Get New Releases 
//   const newReleases = await axios.get(
//     'https://api.spotify.com/v1/browse/new-releases',    
//   {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     }
//   }
//   ).then((res) => res.data.albums.items)
//    .catch(err => console.log(err));

//   // Get Playlists 
//   const playlists = await axios.get(
//     'https://api.spotify.com/v1/browse/featured-playlists',    
//   {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     }
//   }
//   ).then((res) => res.data.playlists.items)
//    .catch(err => console.log(err));
  
//   // Categories 
//   const categories = await axios.get(
//     'https://api.spotify.com/v1/browse/categories',    
//   {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     }
//   }
//   ).then((res) => res.data.categories.items)
//    .catch(err => console.log(err));
  
//   return [newReleases, playlists, categories]
// }

const fetchSongsParallel = async () => {
  const token = await getAuth();
  
  const urls = [
    'https://api.spotify.com/v1/browse/new-releases', 
    'https://api.spotify.com/v1/browse/featured-playlists', 
    'https://api.spotify.com/v1/browse/categories']
  
  const promises = urls.map(url => {
    return axios.get(url,{headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'}})
         .then(res=>res.data);
  });

  return Promise.all(promises).catch(err => console.log(err));
}

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      newReleases: [],
      playlists: [],
      categories: []
    };
  }
  
  async componentDidMount(){
    // const [newReleases, playlists, categories] = await fetchSongs();
    // this.setState({
    //   newReleases: newReleases,
    //   playlists: playlists,
    //   categories: categories,
    // })
    const [newReleases, playlists, categories] = await fetchSongsParallel();
    this.setState({
      newReleases: newReleases.albums.items,
      playlists: playlists.playlists.items,
      categories: categories.categories.items,
    })
  }

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={newReleases} />
        <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
        <DiscoverBlock text="BROWSE" id="browse" data={categories} imagesKey="icons" />
      </div>
    );
  }
}

import React from "react";
import PlaceList from '../components/PlaceList';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const UserPlaces = () =>{

    const PLACES = [
        {
            id:'p1',
            title: 'Qutub Minar',
            imageUrl: 'https://www.thetatva.in/wp-content/uploads/2020/12/53331482_2283781921869816_2361277172979920993_n.jpg',
            address: 'Seth Sarai, Mehrauli, New Delhi, Delhi 110016',
            description: 'LOL here is the lost description element',
            location: {
                lat: 28.5236658,
                lng: 77.1835536
            },
            creator: 'u1'
        },
        {
            id:'p2',
            title: 'Taj Mahal',
            imageUrl: 'https://www.thetatva.in/wp-content/uploads/2020/12/53331482_2283781921869816_2361277172979920993_n.jpg',
            address: 'Seth Sarai, Mehrauli, New Delhi, Delhi 110016',
            description: 'one of the seven wonders of the world',
            location: {
                lat: 28.5236658,
                lng: 77.1835536
            },
            creator: 'u2'
        }
    ];
    const userId = useParams().userId;
    const filterPlaces = PLACES.filter(place => place.creator === userId);

    return (
        <PlaceList items={filterPlaces} />
    );
};

export default UserPlaces;

//Now we have to filter out the places and only display places specifit to a uid of user, not all places will be displayed!
// We will be using a hook - useParams
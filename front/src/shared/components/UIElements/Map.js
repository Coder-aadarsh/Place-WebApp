import React from "react";
import './Map.css';

const Map = props =>{
    return (
        <section class="mapbox" data-mapbox>
          <figure>
            <iframe
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Chandigarh%20University,%20Bhago%20majra%20,%20Punjab%20,%20India+(Your%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              width="600" height="350" loading="lazy"></iframe>
          </figure>
        </section>
    );
};

export default Map;
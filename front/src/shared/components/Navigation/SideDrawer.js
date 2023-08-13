//This app should also work in Mobile screen that why this js file
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './SideDrawer.css';

const SideDrawer = props => {
  const content = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>
    </CSSTransition>
  );

  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;
// classNames="slide-in-left" is special class names which this third-party library knows how to use and which it applies in sequence
//when it animates the element in or animates it out. Now last but not least, i'll add mount on enter and unmount
//i'll add mount on enter and unmount on exit to tell that component and the third-party library that the aside component which is inside of the CSS transition component should really be added to the DOM or be removed from the DOM when it should become visible or invisible, otherwise it's just animated out or in and not really removed, here I want to have it removed or added depending on its state

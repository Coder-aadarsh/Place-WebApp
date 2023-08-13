import React from "react";
import './MainHeader.css';

const MainHeader = props =>{
    return <header className="main-header">
        {props.children}
    </header>
};

export default MainHeader;
//use a dynamic expression and now a special prop, props.children.
//This is one of the very few special props React knows, props.children
//will always refer to the things you pass between your opening and closing tags of your component.


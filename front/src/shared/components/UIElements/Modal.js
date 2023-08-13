import React from "react";
import './Modal.css';
import ReactDOM from "react-dom";
import Backdrop from "./Backdrop";
import { CSSTransition } from "react-transition-group";


const ModalOverlay = props => {
    const content =(
        <div className={`modal ${props.className}`} style={props.style} >
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <form onSubmit={props.onSubmit ? props.onSubmit : event => event.preventDefault()}>
                <div className={`modal__content ${props.contentClass}`}>
                    {props.children}
                </div>
                <footer className={`modal__footer ${props.footerClass}`} >
                    {props.footer}
                </footer>
            </form>
        </div>
    );
    
    return ReactDOM.createPortal( content , document.getElementById('modal-hook'));
};
// Modal overlay component will be used for internal purposes, will not be exported
// modal also needs a backdrop and litte animation
const Modal = props => {
    return (
        <>
        {props.show && <Backdrop onClick={props.onCancel} />}
        <CSSTransition 
        in={props.show} 
        mountOnEnter 
        unmountOnExit 
        timeout={200} 
        classNames="modal">
            <ModalOverlay {...props} />
        </CSSTransition>
        </>
    );
};


export default Modal;

// {...props}  - we forward all the props we get from outside to modal overlay.
//This syntax might look strange but what it does is it takes the props we pass to modal which is the
//component we export and forwards them to modal overlay, which is the internal component which we don't export. This allows us to set for example footer, footer class, content class, header and so on, on the exported modal component where we of course don't need it,
//we don't use it here but we then forward it to modal overlay. So it allows us to set props on this internal component from outside so to say

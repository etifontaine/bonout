import React, { useRef, useEffect, useContext } from 'react';
import { CSSTransition as ReactCSSTransition } from 'react-transition-group';

const TransitionContext = React.createContext({
  parent: {},
})

function useIsInitialRender() {
  const isInitialRender = useRef(true);
  useEffect(() => {
    isInitialRender.current = false;
  }, [])
  return isInitialRender.current;
}

function CSSTransition({
  show,
  enter = '',
  enterStart = '',
  enterEnd = '',
  leave = '',
  leaveStart = '',
  leaveEnd = '',
  appear,
  unmountOnExit,
  tag = 'div',
  children,
  ...rest
}) {
  const removeFromDom = unmountOnExit;

  function getClasses(kind) {
    return kind.split(' ').filter((s) => s.length)
  }

  function addClasses(node, classes) {
    classes.length && node.classList.add(...classes);
  }

  function removeClasses(node, classes) {
    classes.length && node.classList.remove(...classes);
  }

  const nodeRef = React.useRef(null);
  const Component = tag;

  return (
    <ReactCSSTransition
      appear={appear}
      nodeRef={nodeRef}
      unmountOnExit={removeFromDom}
      in={show}
      addEndListener={(done) => {
        nodeRef.current.addEventListener('transitionend', done, false)
      }}
      onEnter={() => {
        if (!removeFromDom) nodeRef.current.style.display = null;
        addClasses(nodeRef.current, [...getClasses(enter), ...getClasses(enterStart)])
      }}
      onEntering={() => {
        removeClasses(nodeRef.current, getClasses(enterStart))
        addClasses(nodeRef.current, getClasses(enterEnd))
      }}
      onEntered={() => {
        removeClasses(nodeRef.current, [...getClasses(enterEnd), ...getClasses(enter)])
      }}
      onExit={() => {
        addClasses(nodeRef.current, [...getClasses(leave), ...getClasses(leaveStart)])
      }}
      onExiting={() => {
        removeClasses(nodeRef.current, getClasses(leaveStart))
        addClasses(nodeRef.current, getClasses(leaveEnd))
      }}
      onExited={() => {
        removeClasses(nodeRef.current, [...getClasses(leaveEnd), ...getClasses(leave)])
        if (!removeFromDom) nodeRef.current.style.display = 'none';
      }}
    >
      <Component ref={nodeRef} {...rest} style={{ display: !removeFromDom ? 'none' : null }}>{children}</Component>
    </ReactCSSTransition>
  )
}

function Transition({ show, appear, ...rest }) {
  const { parent } = useContext(TransitionContext);
  const isInitialRender = useIsInitialRender();
  const isChild = show === undefined;

  if (isChild) {
    return (
      <CSSTransition
        appear={parent.appear || !parent.isInitialRender}
        show={parent.show}
        {...rest}
      />
    )
  }

  return (
    <TransitionContext.Provider
      value={{
        parent: {
          show,
          isInitialRender,
          appear,
        },
      }}
    >
      <CSSTransition appear={appear} show={show} {...rest} />
    </TransitionContext.Provider>
  )
}

export default Transition;
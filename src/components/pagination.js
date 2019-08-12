import React from 'react'
import { css } from '@emotion/core'
import { navigate } from 'gatsby'

export default class Pagination extends React.Component {
  constructor(props) {
    super(props)

    this.counter = React.createRef()
    this.pl = React.createRef()
    this.pr = React.createRef()

    this.state = {
      index: props.pageContext.pageNumber,
      total: props.pageContext.numberOfPages,
    }
  }
  render() {
    const { previousPagePath, nextPagePath } = this.props.pageContext
    const { index, total } = this.state

    const isFirst = index === 0
    const isLast = index === total - 1

    return (
      <div css={{
        position: 'relative',
        margin: '20px',
        height: '30px'
      }}>
        <div css={counter} ref={this.counter}>{index + 1} / {total}</div>
        <button data-state={isFirst ? 'disabled' : ''} css={css`${left}`} ref={this.pl} onClick={() => !isFirst ? navigate(previousPagePath) : null}><i></i><i></i></button>
        <button data-state={index === total - 1 ? 'disabled' : ''} css={css`${right}`} ref={this.pr} onClick={() => !isLast ? navigate(nextPagePath) : null}><i></i><i></i></button>
      </div>
    )
  }
}

// px
const size = 20
const thickness = 5

// deg
const angle = 40
const angleHover = 25
const angleActive = 20

const counter = css`
  text-align: center;
  position: absolute;
  width: 100%;
  top: 20%;
  margin-top: -15px;
  font-size: 20px;
  font-family: Helvetica, sans-serif;
  text-shadow: 0px 2px 0px rgba( 0, 0, 0, 0.2 );
  color: #000;
  `

const arrowTransform = (angle, x, y) => {
  return css`
    i:first-of-type {
      transform: translate( ${x}px, ${y}px ) rotate( ${angle}deg );
    }

    i:last-of-type {
      transform: translate( ${x}px, ${-y}px ) rotate( ${-angle}deg );
    }
    `
}

const button = css`
  -webkit-appearance: none;
  background: transparent;
  border: 0;
  outline: 0;
  `

const paginate = css`
  position: relative;
  margin: 10px;
  width: ${size}px;
  height: ${size}px;
  cursor: pointer;
  transform: translate3d(0,0,0); // fixes flicker in webkit

  position: absolute;
  top: 50%;
  margin-top: -20px;
  -webkit-filter: drop-shadow(0 2px 0px rgba(0,0,0,0.2));

  i {
    position: absolute;
    top: 40%;
    left: 0;
    width: ${size}px;
    height: ${thickness}px;
    border-radius: ${thickness / 2}px;
    background: #000;

    transition: all 0.15s ease;
  }

  &[data-state=disabled] {
    opacity: 0.3;
    cursor: default;
  }
  `

const left = css`
  ${button}
  ${paginate}

  right: 58%;

  i {
    transform-origin: 0% 50%
  }

  ${arrowTransform(angle, 0, -1)}

  &:hover {
    ${arrowTransform(angleHover, 0, -1)}
  }

  &:active {
    ${arrowTransform(angleActive, 1, -1)}
  }

  &[data-state=disabled] {
    ${arrowTransform(0, -5, 0)}

    &:hover {
      ${arrowTransform(0, -5, 0)}
    }
  }
  `

const right = css`
  ${button}
  ${paginate}

  left: 58%;

  i {
    transform-origin: 100% 50%
  }

  ${arrowTransform(angle, 0, 1)}

  &:hover {
    ${arrowTransform(angleHover, 0, 1)}
  }

  &:active {
    ${arrowTransform(angleActive, 1, 1)}
  }

  &[data-state=disabled] {
    ${arrowTransform(0, 5, 0)}

    &:hover {
      ${arrowTransform(0, 5, 0)}
    }
  }
  `

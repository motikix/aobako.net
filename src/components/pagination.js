import { Link } from 'gatsby'
import React from 'react'

const Pagination = ({pageContext}) => {
  console.log(pageContext)
  const { previousPagePath, nextPagePath } = pageContext

  return (
    <div>
      {previousPagePath ? <Link to={previousPagePath}>Previous</Link> : null }
      {nextPagePath ? <Link to={nextPagePath}>Next</Link> : null }
    </div>
  )
}

export default Pagination

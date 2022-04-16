import React from 'react'

const RepoData = ({ fullName , owner , forkCount , starCount , language }) => {    
    return (
        <div className='repo'>
            <h2>Repository : {fullName}</h2>
            <p>Owner <i className='fas fa-user'></i> : {owner}</p>
            <p>Fork Count <i className='fas fa-code'></i> : {forkCount}</p>
            <p>Star Count <i className='fas fa-star'></i> : {starCount}</p>
            <p>Language <i className='fas fa-language'></i> : {language}</p>
        </div>
    )
}

export default RepoData
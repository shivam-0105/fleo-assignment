import React , { useEffect, useState } from 'react';
import '../App.css';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import RepoData from './RepoData';
import Spinner from './Spinner';

const Pagination = () => {

    useEffect(() => {
        const getRepos = async () => {
            try {
                const res = await axios.get('https://api.github.com/search/repositories?q=language:Javascript&sort=stars&order=desc');
                console.log(res.data.items);
                setRepos(res.data.items);
            }
            catch (error) {
                console.log(error);
            }
        };
        getRepos();
    } , []);

    const [repos , setRepos] = useState([]);
    const [pageNumber , setPageNumber] = useState(0);
    const [inputText , setInputText] = useState("");
    const [sortValue , setSortValue] = useState('asc');

    const handleRadioChange = (e) => {
        setSortValue(e.target.value);
    }

    let inputHandler = (e) => {
        var lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    }

    const reposPerPage = 5;
    const pagesVisited = pageNumber * reposPerPage;

    const displayRepos = repos
        .slice(pagesVisited , pagesVisited + reposPerPage)
        .filter((data) => {
            if ( inputText === '' ) {
                return data;
            }
            else {
                const filteredDataName = data.full_name.toLowerCase().includes(inputText);
                const filteredDataLanguage =  data.language.toLowerCase().includes(inputText);
                return (filteredDataName || filteredDataLanguage);
            }
        })
        .sort((a , b) => {
            const nameA = a.full_name.toLowerCase();
            const nameB = b.full_name.toLowerCase();
            const starA = a.stargazers_count;
            const starB = b.stargazers_count;
            if ( sortValue === 'asc' ) {
                if ( starA < starB ) return -1;
                if ( starA > starB ) return 1;
                else {
                    if ( nameA < nameB ) return -1;
                    if ( nameA > nameB ) return 1;
                    return 0;
                }
            }
            else {
                if ( starA < starB ) return 1;
                if ( starA > starB ) return -1;
                else {
                    if ( nameA < nameB ) return 1;
                    if ( nameA > nameB ) return -1;
                    return 0;
                }
            }
        })
        .map((repo , index) => {
            return (
                <RepoData 
                    key={index} 
                    fullName={repo.full_name}
                    owner={repo.owner.login}
                    forkCount={repo.forks_count}
                    starCount={repo.stargazers_count}  
                    language={repo.language}
                />
            );
        });

    const pageCount = Math.ceil(repos.length / reposPerPage);

    const changePage = ({selected}) => {
        setPageNumber(selected);
    }

    return (
        <div>
            {
                repos.length === 0 ? <Spinner /> : 
                <div className='outer-div'>
                    <div className='searchBox'>
                        <input 
                            placeholder='Search by Name or Language' 
                            type="text" 
                            onChange={inputHandler}
                        />
                    </div>
                    <div className='radioButton'>
                        <div>
                            <input
                            type="radio"
                            value="asc"
                            checked={sortValue === 'asc'}
                            onChange={handleRadioChange}
                            /> Ascending
                        </div>
                        <div>
                            <input
                            type="radio"
                            value="desc"
                            checked={sortValue === 'desc'}
                            onChange={handleRadioChange}
                            /> Descending
                        </div>
                    </div>
                    
                    {displayRepos}
                    <ReactPaginate 
                        previousLabel = {"Previous"}
                        nextLabel = {"Next"}
                        pageCount = {pageCount}
                        onPageChange = {changePage}
                        containerClassName = {"paginationBttns"}
                        previousLinkClassName = {"previousBttn"}
                        nextLinkClassName = {"nextBttn"}
                        disabledClassName = {"paginationDisabled"} 
                        activeClassName = {"paginationActive"}
                    />
                </div>
            }
        </div>
    )
}

export default Pagination
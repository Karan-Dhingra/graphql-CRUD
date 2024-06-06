import React from 'react'
import { GET_PROJECTS } from '../queries/projectQueries'
import { useQuery } from '@apollo/client'
import Spinner from './Spinner'
import ProjectCard from './ProjectCard'

const Projects = () => {
    const {loading, error, data} = useQuery(GET_PROJECTS)

    if(loading) <Spinner />
    if(error) <pre>{error}</pre>

    if(data?.projects?.length === 0){
        return <div className="row mt-4">
            <p>No Projects</p>
        </div>
    }

    return (
        <div className='row mt-4'>
            {!loading && !error && data?.projects?.map((project, key) => (
                <ProjectCard key={key} project={project} />
            ))}
        </ div>
    );
}

export default Projects
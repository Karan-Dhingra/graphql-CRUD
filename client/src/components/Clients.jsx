import { useQuery } from '@apollo/client'
import React from 'react'
import ClientRow from './ClientRow'
import { GET_CLIENTS } from '../queries/clientQueries'
import Spinner from './Spinner'


const Clients = () => {
    const {loading, error, data} = useQuery(GET_CLIENTS)

    if(loading) <Spinner />
    if(error) <pre>{error}</pre>

    return (
        <>
            {!loading && !error && (
                <table className='table table-hover mt-3'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.clients.map((client, key) => (
                            <ClientRow key={key} client={client} />
                        ))}
                    </tbody>
                </table>
            )}
        </>
    )
}

export default Clients
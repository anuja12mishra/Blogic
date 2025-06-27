import React from 'react'
import { FaRegEye } from "react-icons/fa";
function ViewsCount(props) {

    // console.log('props',props.props)
    return (
        <div >
            {
                props.props ?
                    <div className='flex items-center gap-1'>
                        <FaRegEye />
                        <p  className='flex justify-center items-center'>{props.props}</p>
                    </div>

                    : <p>Loading...</p>
            }

        </div>
    )
}

export default ViewsCount
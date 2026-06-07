import React from 'react';

const teacherDetailPage = async ({params}) => {
    const {id}= await params
const res =await fetch(`http://localhost:5000/teachers/${id}`)
const teachers = await res.json() 
    console.log(teachers)
    return (
        <div>
            
        </div>
    );
};

export default teacherDetailPage;
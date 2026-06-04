import React from 'react';



const TeacherPage = async () => {
const res = await fetch('http://localhost:5000/teachers')
const teachers = await (await res).json
    return (
        <div>
            
        </div>
    );
};

export default TeacherPage;
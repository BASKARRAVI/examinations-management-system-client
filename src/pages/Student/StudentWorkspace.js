import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import StudentProfile from './Profile';
import ExamMarks from './ViewExamMarks';

export default function StudentWorkspace() {
    const components = [
        <StudentProfile />, <ExamMarks />, <></>
    ];
    const [key, setKey] = useState(
        window.sessionStorage.getItem('adminWorkspacePageKey') || 0
    );
    return (
        <table style={{
            width: '100%',
            height: '100%',
        }}>
            <tbody><tr className=''>
                <td style={{
                    width: '15%',
                    height: '95vh',
                    backgroundColor: 'azure'
                }}
                    className='align-top pt-5 px-3 border-end'
                >
                    <Nav defaultActiveKey={0}
                        onSelect={(ekey) => {
                            setKey(ekey);
                            window.sessionStorage.setItem('adminWorkspacePageKey', ekey);
                        }}>
                        {
                            ['View Profile', 'View Marks', 'Change Password']
                                .map((item, index) => {
                                    return (
                                        <Nav.Link
                                            eventKey={index}
                                            className='text-dark w-100'
                                            key={index}
                                        >
                                            <Button variant={parseInt(key) === index ? 'info' : ''}
                                                className='w-100 py-1 my-1'
                                            >
                                                {item}
                                            </Button>
                                        </Nav.Link>
                                    )
                                })
                        }
                    </Nav>
                </td>
                <td className='align-top'>
                    <br />
                    <br />
                    {components[key]}
                </td>
            </tr></tbody>
        </table >
    );
}



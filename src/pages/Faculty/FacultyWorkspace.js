import { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import ChangePassword from '../../components/ChangePassword';
import AllocatedExams from './AllocatedExams';

export function FacultyWorkspace() {
    const components = [<AllocatedExams />, <ChangePassword />];
    const [key, setKey] = useState(0);
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
                    <Nav defaultActiveKey="exams" className='flex-column position-sticky'
                        onSelect={(ekey) => {
                            setKey(ekey);
                        }}>
                        {
                            ['Exams', 'Change Password']
                                .map((item, index) => {
                                    return <Nav.Link
                                        eventKey={index}
                                        className={parseInt(key) === index ? 'text-decoration-underline text-dark' : 'text-dark'}>
                                        {item}
                                    </Nav.Link>
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

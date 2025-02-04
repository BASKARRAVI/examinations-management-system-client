import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import ExamData from './ExamData';
import { useParams } from 'react-router-dom';
import { numbersToWords } from '../../reducers/Utils';
import axios from 'axios';
import { serverurl } from '../../reducers/Constants';
import { numToRoman } from '../../reducers/Utils';
import { AppState } from '../../reducers/AppContextProvider';

export default function Print2() {
    const [examBatch, setExamBatch] = useState({});
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState([]);

    const { examBatchId } = useParams();

    const { user } = AppState();


    return (
        <div className='pt-3 bg-dark'>

            <ExamData
                examBatchId={examBatchId}
                examBatch={examBatch}
                setExamBatch={setExamBatch}
                setStudents={setStudents}
                setMarks={setMarks}
            />
            <PDFViewer style={{
                width: '100%',
                height: '100vh'
            }}>
                <MyDocument
                    students={students}
                    marks={marks}
                    examBatch={examBatch}
                    facultyName={user.fullname}
                />
            </PDFViewer>
        </div>
    )
}

function MyDocument(props) {
    const { students, marks, examBatch, facultyName } = props;
    const [examName, setExamName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [branchName, setBranchName] = useState('');
    const [yearOfStudy, setYearOfStudy] = useState('');


    useEffect(() => {
        if (examBatch.examid) {
            axios({
                method: "get",
                url: serverurl + "/exams/" + examBatch.examid + "/getName",
                headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem('token') }
            })
                .then((res) => {
                    setExamName(res.data.examName)
                })
                .catch((err) => {
                    console.log(err);
                });

            axios({
                method: "get",
                url: serverurl + "/courses/" + examBatch.courseid,
                headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem('token') }
            })
                .then((res) => {
                    setCourseName(res.data.course.name)
                    setYearOfStudy(numToRoman((res.data.course.semester + 1) / 2))
                })
                .catch((err) => {
                    console.log(err);
                });

            axios({
                method: "get",
                url: serverurl + "/branches/getById",
                params: { "id": examBatch.branchid },
                headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem('token') }
            })
                .then((res) => {
                    setBranchName(res.data.branch.name)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [examBatch])

    return (
        <>
            <Document title={(examName + "_" + marks[0]?.courseid + "_" + examBatch?.name).replaceAll(" ", "_") + " Print 1"}>
                <Page size="A4" style={styles.page}>

                    <View style={styles.table}>
                        <Text style={{ ...styles.titleText, paddingBottom: '2.5px' }}>
                            K.S.RANGASAMY COLLEGE OF TECHNOLOGY, TIRUCHENGODE - 637 215
                        </Text>

                        <Text style={{ ...styles.titleText, paddingBottom: '15px', fontSize: 9 }}>
                            (An Autonomous Institution Affiliated to Anna University, Chennai - 600 025)
                        </Text>

                        <View style={{ ...styles.tr, border: '0', padding: '0 0px' }}>
                            <Text style={{ ...styles.th, width: '50%', border: '0' }}>
                                Course Code: {marks[0]?.courseid}
                            </Text>
                            <Text style={{ ...styles.th, width: '50%', border: '0', paddingLeft: '20px' }}>
                                Year: {yearOfStudy}
                            </Text>
                        </View>
                        <View style={{ ...styles.tr, border: '0', padding: '0 0px', paddingBottom: '15px' }}>
                            <Text style={{ ...styles.th, width: '50%', border: '0', }}>
                                Course Title: {courseName}
                            </Text>
                            <Text style={{ ...styles.th, width: '50%', border: '0', paddingLeft: '20px' }}>
                                Branch: {branchName}
                            </Text>
                        </View>

                        {/* head */}
                        <View style={styles.tr}>
                            <Text style={{ ...styles.th, width: '35%' }}>Sno</Text>
                            <Text style={{ ...styles.th, width: '110%' }}>Register number</Text>
                            <Text style={{ ...styles.th, width: '220%' }}>Full name</Text>
                            {/* <Text style={{ ...styles.th, width: '100%' }}>Attendance</Text> */}
                            <Text style={{ ...styles.th, width: '65%', textAlign: '' }}>Marks in numbers</Text>
                            <Text style={{ ...styles.th, width: '140%' }}>Marks in words</Text>
                            {/* <Text style={{ ...styles.th, width: '140%' }}>Student sign</Text> */}
                        </View>
                        {/* body */}
                        {
                            students.map((st, ind) => (
                                <View style={styles.tr} key={ind}>
                                    <Text style={{ ...styles.td, width: '35%' }} >{ind + 1}</Text>
                                    <Text style={{ ...styles.td, width: '110%' }}>{st?.id}</Text>
                                    <Text style={{ ...styles.td, width: '220%' }}>{st?.fullname}</Text>
                                    {/* <Text style={{ ...styles.td, width: '100%' }}>{
                                        marks?.find(m => m.studentid === st.id)?.attendance ? "Present" : "Absent"
                                    }</Text> */}
                                    <Text style={{ ...styles.td, width: '65%', textAlign: '' }}>{
                                        marks?.find(m => m.studentid === st.id)?.attendance ?
                                            marks?.find(m => m.studentid === st.id)?.mark
                                            : "Ab"
                                    }</Text>
                                    <Text style={{ ...styles.td, width: '140%' }}>{
                                        marks?.find(m => m.studentid === st.id)?.attendance ?
                                            numbersToWords(marks?.find(m => m.studentid === st.id)?.mark)
                                            : "Ab"
                                    }</Text>
                                    {/* <Text style={{ ...styles.td, width: '140%' }}></Text> */}
                                </View>
                            ))
                        }


                        <Text style={{ ...styles.footerText, paddingTop: '20px' }}>
                            Internal Examiner 1: {facultyName}
                        </Text>
                        <Text style={{ ...styles.footerText, }}>
                            Internal Examiner 2:
                        </Text>

                    </View>
                </Page>
            </Document>
        </>
    )
}


const styles = StyleSheet.create({
    titleText: {
        fontSize: 12,
        width: '100%',
        textAlign: 'center',
        flexDirection: 'row',
    },
    examDetail: {
        fontSize: 11,
        width: '50%',
        textAlign: 'left',
        paddingBottom: '20px'
    },
    footerText: {
        fontSize: 10.5,
        width: '100%',
        textAlign: 'left',
        flexDirection: 'row',
        paddingBottom: '5px',
        paddingLeft: '57.5%'
    },
    page: {
        flexDirection: 'row',
        backgroundColor: ''
    },
    table: {
        display: 'table',
        // borderTop: '1px solid black',
        margin: '25px',
        width: '100%',
    },

    th: {
        borderTop: '1px solid black',
        width: '100%',
        borderRight: '1px solid black',
        fontSize: 10,
        padding: '4px 3px',
    },

    tr: {
        width: '100%',
        flexDirection: 'row',
        borderBottom: '1px solid black',
        borderLeft: '1px solid black'
    },
    td: {
        width: '100%',
        borderRight: '1px solid black',
        fontSize: 9.5,
        padding: '4px 3.5px'
    },

});

import React from 'react'
import {Widget} from '@typeform/embed-react'
import styles from '../../../styles/TypeForm.module.css'
import { useRouter } from "next/router";
const formId = 'les3UfZC';

const TypeFormWidget = () => {
    const router = useRouter();
    const handleSubmit = async(data:any) => {
        const response =await fetch(`/api/createDao.response?id=${formId}&response_id=${data.responseId}`);
        router.replace(`/prelaunch`)
        if(response.ok) {
            const data= await response.json()
            console.log('data',data)
        }

    }
    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <Widget id={formId} style={{width: '900px', height: '500px'}} hideHeaders={true} onSubmit={handleSubmit}/>
            </div>
            <div className={styles.hidder}>
                {}
            </div>
        </div>
    )
}

export default TypeFormWidget
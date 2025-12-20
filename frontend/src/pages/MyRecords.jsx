import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const MyRecords = () => {

    const { token, backendUrl } = useContext(AppContext)
    const { t } = useTranslation(['records'])
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedRecord, setSelectedRecord] = useState(null)

    // 取得病患的所有病歷
    const fetchRecords = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(
                `${backendUrl}/api/medical-records/my-records`,
                { headers: { token } }
            )
            if (data.success) {
                setRecords(data.records)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(t('records:errorLoading'))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) {
            fetchRecords()
        }
    }, [token])

    // 格式化日期
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className='min-h-[60vh]'>
            <h1 className='text-2xl font-medium text-gray-700 pb-3 border-b'>{t('records:title')}</h1>

            {loading ? (
                <div className='flex justify-center items-center py-20'>
                    <div className='text-gray-500'>{t('records:loading')}</div>
                </div>
            ) : records.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-20'>
                    <div className='text-6xl mb-4'>📋</div>
                    <p className='text-gray-500 text-lg'>{t('records:noRecords')}</p>
                    <p className='text-gray-400 text-sm mt-2'>{t('records:noRecordsHint')}</p>
                </div>
            ) : (
                <div className='mt-6 space-y-4'>
                    {records.map((record) => (
                        <div
                            key={record._id}
                            className='bg-white border rounded-lg p-5 hover:shadow-md transition-all cursor-pointer'
                            onClick={() => setSelectedRecord(record)}
                        >
                            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                                {/* Doctor Info */}
                                <div className='flex items-center gap-4'>
                                    <img
                                        src={record.doctorId?.image || '/default-avatar.png'}
                                        alt=''
                                        className='w-14 h-14 rounded-full object-cover bg-gray-100'
                                    />
                                    <div>
                                        <p className='font-medium text-gray-800'>
                                            {record.doctorId?.name || t('records:doctor')}
                                        </p>
                                        <p className='text-sm text-gray-500'>
                                            {record.doctorId?.speciality}
                                        </p>
                                    </div>
                                </div>

                                {/* Diagnosis */}
                                <div className='flex-1 sm:px-6'>
                                    <p className='text-primary font-semibold text-lg'>
                                        {record.diagnosis}
                                    </p>
                                    <div className='flex flex-wrap gap-1 mt-2'>
                                        {record.symptoms?.slice(0, 4).map((s, i) => (
                                            <span
                                                key={i}
                                                className='text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded'
                                            >
                                                {s}
                                            </span>
                                        ))}
                                        {record.symptoms?.length > 4 && (
                                            <span className='text-xs text-gray-400'>
                                                +{record.symptoms.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Date */}
                                <div className='text-right'>
                                    <p className='text-sm text-gray-500'>{formatDate(record.createdAt)}</p>
                                    {record.followUpDate && (
                                        <p className='text-xs text-primary mt-1'>
                                            {t('records:followUp')}：{formatDate(record.followUpDate)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selectedRecord && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto'>
                        {/* Header */}
                        <div className='sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center'>
                            <h2 className='text-xl font-semibold text-gray-800'>{t('records:detailsTitle')}</h2>
                            <button
                                onClick={() => setSelectedRecord(null)}
                                className='text-gray-400 hover:text-gray-600 text-2xl'
                            >
                                ×
                            </button>
                        </div>

                        <div className='p-6 space-y-5'>
                            {/* Doctor Info */}
                            <div className='flex items-center gap-4 bg-gray-50 p-4 rounded-lg'>
                                <img
                                    src={selectedRecord.doctorId?.image || '/default-avatar.png'}
                                    alt=''
                                    className='w-16 h-16 rounded-full object-cover'
                                />
                                <div>
                                    <p className='font-medium text-gray-800 text-lg'>
                                        {selectedRecord.doctorId?.name}
                                    </p>
                                    <p className='text-gray-500'>{selectedRecord.doctorId?.speciality}</p>
                                    <p className='text-sm text-gray-400 mt-1'>
                                        {t('records:visitDate')}：{formatDate(selectedRecord.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Diagnosis */}
                            <div>
                                <h3 className='text-sm font-medium text-gray-500 mb-2'>{t('records:diagnosis')}</h3>
                                <p className='text-xl font-semibold text-primary'>{selectedRecord.diagnosis}</p>
                            </div>

                            {/* Symptoms */}
                            {selectedRecord.symptoms?.length > 0 && (
                                <div>
                                    <h3 className='text-sm font-medium text-gray-500 mb-2'>{t('records:symptoms')}</h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {selectedRecord.symptoms.map((s, i) => (
                                            <span
                                                key={i}
                                                className='bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm'
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Treatment */}
                            {selectedRecord.treatment && (
                                <div>
                                    <h3 className='text-sm font-medium text-gray-500 mb-2'>{t('records:treatment')}</h3>
                                    <p className='text-gray-700 bg-gray-50 p-3 rounded-lg'>
                                        {selectedRecord.treatment}
                                    </p>
                                </div>
                            )}

                            {/* Prescription */}
                            {selectedRecord.prescription?.length > 0 && selectedRecord.prescription[0]?.medicine && (
                                <div>
                                    <h3 className='text-sm font-medium text-gray-500 mb-2'>{t('records:prescription')}</h3>
                                    <div className='bg-green-50 rounded-lg p-4 space-y-3'>
                                        {selectedRecord.prescription.map((p, i) => (
                                            p.medicine && (
                                                <div key={i} className='border-b border-green-100 last:border-0 pb-2 last:pb-0'>
                                                    <div className='flex items-center gap-2 mb-1'>
                                                        <span className='text-green-600'>💊</span>
                                                        <span className='font-medium text-gray-800'>{p.medicine}</span>
                                                        <span className='text-gray-600'>- {p.dosage}</span>
                                                    </div>
                                                    <p className='text-sm text-gray-600 ml-6'>{p.duration}</p>
                                                    {p.notes && (
                                                        <p className='text-sm text-gray-500 ml-6 italic'>※ {p.notes}</p>
                                                    )}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            {selectedRecord.notes && (
                                <div>
                                    <h3 className='text-sm font-medium text-gray-500 mb-2'>{t('records:doctorNotes')}</h3>
                                    <p className='text-gray-700 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400'>
                                        {selectedRecord.notes}
                                    </p>
                                </div>
                            )}

                            {/* Follow Up */}
                            {selectedRecord.followUpDate && (
                                <div className='bg-primary/10 p-4 rounded-lg flex items-center gap-3'>
                                    <span className='text-2xl'>📅</span>
                                    <div>
                                        <p className='text-sm text-primary font-medium'>{t('records:followUpDate')}</p>
                                        <p className='text-primary text-lg font-semibold'>
                                            {formatDate(selectedRecord.followUpDate)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyRecords

import React, { useState, useEffect, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const AllMedicalRecords = () => {

    const { aToken, backendUrl } = useContext(AdminContext)
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedRecord, setSelectedRecord] = useState(null)

    // 取得所有病歷
    const fetchRecords = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(
                `${backendUrl}/api/medical-records/all`,
                { headers: { atoken: aToken } }
            )
            if (data.success) {
                setRecords(data.records)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error('Failed to load records')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (aToken) {
            fetchRecords()
        }
    }, [aToken])

    // 格式化日期
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className='m-5 w-full max-w-6xl'>
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-2xl font-semibold text-gray-700'>病歷管理</h1>
                <div className='text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded'>
                    共 {records.length} 筆病歷
                </div>
            </div>

            {/* Records List */}
            <div className='bg-white rounded-lg shadow'>
                {loading ? (
                    <div className='p-8 text-center text-gray-500'>載入中...</div>
                ) : records.length === 0 ? (
                    <div className='p-8 text-center text-gray-500'>
                        <p>尚無病歷記錄</p>
                        <p className='text-sm mt-2'>請先執行 <code className='bg-gray-100 px-2 py-0.5 rounded'>pnpm run seed:records</code> 建立 Demo 資料</p>
                    </div>
                ) : (
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>病患</th>
                                    <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>醫生</th>
                                    <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>診斷</th>
                                    <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>症狀</th>
                                    <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>建立日期</th>
                                    <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>操作</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y'>
                                {records.map((record) => (
                                    <tr key={record._id} className='hover:bg-gray-50'>
                                        <td className='px-4 py-3'>
                                            <span className='text-sm font-medium'>{record.patientId?.name || 'Unknown'}</span>
                                            <p className='text-xs text-gray-500'>{record.patientId?.email}</p>
                                        </td>
                                        <td className='px-4 py-3'>
                                            <span className='text-sm'>{record.doctorId?.name || 'Unknown'}</span>
                                            <p className='text-xs text-gray-500'>{record.doctorId?.speciality}</p>
                                        </td>
                                        <td className='px-4 py-3 text-sm font-medium text-gray-800'>
                                            {record.diagnosis}
                                        </td>
                                        <td className='px-4 py-3'>
                                            <div className='flex flex-wrap gap-1'>
                                                {record.symptoms?.slice(0, 2).map((s, i) => (
                                                    <span key={i} className='text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded'>
                                                        {s}
                                                    </span>
                                                ))}
                                                {record.symptoms?.length > 2 && (
                                                    <span className='text-xs text-gray-500'>+{record.symptoms.length - 2}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className='px-4 py-3 text-sm text-gray-600'>
                                            {formatDate(record.createdAt)}
                                        </td>
                                        <td className='px-4 py-3'>
                                            <button
                                                onClick={() => setSelectedRecord(record)}
                                                className='text-primary text-sm hover:underline'
                                            >
                                                查看詳情
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedRecord && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
                        <div className='flex justify-between items-start mb-4'>
                            <h2 className='text-xl font-semibold'>病歷詳情</h2>
                            <button
                                onClick={() => setSelectedRecord(null)}
                                className='text-gray-400 hover:text-gray-600 text-2xl'
                            >
                                ×
                            </button>
                        </div>

                        <div className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg'>
                                <div>
                                    <p className='text-sm text-gray-500'>病患</p>
                                    <p className='font-medium'>{selectedRecord.patientId?.name || 'Unknown'}</p>
                                    <p className='text-sm text-gray-500'>{selectedRecord.patientId?.email}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>看診醫生</p>
                                    <p className='font-medium'>{selectedRecord.doctorId?.name || 'Unknown'}</p>
                                    <p className='text-sm text-gray-500'>{selectedRecord.doctorId?.speciality}</p>
                                </div>
                            </div>

                            <div className='border-t pt-4'>
                                <p className='text-sm text-gray-500 mb-1'>診斷</p>
                                <p className='font-semibold text-lg text-primary'>{selectedRecord.diagnosis}</p>
                            </div>

                            {selectedRecord.symptoms?.length > 0 && (
                                <div>
                                    <p className='text-sm text-gray-500 mb-2'>症狀</p>
                                    <div className='flex flex-wrap gap-2'>
                                        {selectedRecord.symptoms.map((s, i) => (
                                            <span key={i} className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm'>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedRecord.treatment && (
                                <div>
                                    <p className='text-sm text-gray-500 mb-1'>治療方案</p>
                                    <p className='text-gray-800'>{selectedRecord.treatment}</p>
                                </div>
                            )}

                            {selectedRecord.prescription?.length > 0 && selectedRecord.prescription[0]?.medicine && (
                                <div>
                                    <p className='text-sm text-gray-500 mb-2'>處方藥物</p>
                                    <div className='bg-gray-50 rounded-lg p-3'>
                                        {selectedRecord.prescription.map((p, i) => (
                                            p.medicine && (
                                                <div key={i} className='flex flex-wrap gap-4 py-2 border-b last:border-0'>
                                                    <span className='font-medium'>{p.medicine}</span>
                                                    <span className='text-gray-600'>{p.dosage}</span>
                                                    <span className='text-gray-600'>{p.duration}</span>
                                                    {p.notes && <span className='text-gray-500 italic'>{p.notes}</span>}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedRecord.notes && (
                                <div>
                                    <p className='text-sm text-gray-500 mb-1'>醫生備註</p>
                                    <p className='text-gray-800 bg-yellow-50 p-3 rounded'>{selectedRecord.notes}</p>
                                </div>
                            )}

                            {selectedRecord.followUpDate && (
                                <div className='bg-primary/10 p-3 rounded-lg'>
                                    <p className='text-sm text-primary'>📅 追蹤回診日期：{formatDate(selectedRecord.followUpDate)}</p>
                                </div>
                            )}

                            <div className='text-xs text-gray-400 pt-4 border-t'>
                                建立時間：{formatDate(selectedRecord.createdAt)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AllMedicalRecords

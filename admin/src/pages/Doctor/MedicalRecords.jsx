import React, { useState, useEffect, useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MedicalRecords = () => {

    const { dToken, backendUrl } = useContext(DoctorContext)
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)

    // Form state
    const [formData, setFormData] = useState({
        patientId: '',
        diagnosis: '',
        symptoms: '',
        treatment: '',
        prescription: [{ medicine: '', dosage: '', duration: '', notes: '' }],
        notes: '',
        followUpDate: ''
    })

    // 取得醫生的所有病歷
    const fetchRecords = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(
                `${backendUrl}/api/medical-records/doctor-records`,
                { headers: { dToken } }
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
        if (dToken) {
            fetchRecords()
        }
    }, [dToken])

    // 處理表單提交
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const symptomsArray = formData.symptoms.split(',').map(s => s.trim()).filter(s => s)

            const { data } = await axios.post(
                `${backendUrl}/api/medical-records/create`,
                {
                    ...formData,
                    symptoms: symptomsArray,
                    prescription: formData.prescription.filter(p => p.medicine)
                },
                { headers: { dToken } }
            )

            if (data.success) {
                toast.success('病歷建立成功!')
                setShowCreateForm(false)
                setFormData({
                    patientId: '',
                    diagnosis: '',
                    symptoms: '',
                    treatment: '',
                    prescription: [{ medicine: '', dosage: '', duration: '', notes: '' }],
                    notes: '',
                    followUpDate: ''
                })
                fetchRecords()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error('建立病歷失敗')
        }
    }

    // 新增處方欄位
    const addPrescription = () => {
        setFormData(prev => ({
            ...prev,
            prescription: [...prev.prescription, { medicine: '', dosage: '', duration: '', notes: '' }]
        }))
    }

    // 更新處方
    const updatePrescription = (index, field, value) => {
        const updated = [...formData.prescription]
        updated[index][field] = value
        setFormData(prev => ({ ...prev, prescription: updated }))
    }

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
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className='bg-primary text-white px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all'
                >
                    {showCreateForm ? '取消' : '+ 新增病歷'}
                </button>
            </div>

            {/* Create Form */}
            {showCreateForm && (
                <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg shadow mb-6'>
                    <h2 className='text-lg font-semibold mb-4'>建立新病歷</h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-600 mb-1'>病患 ID *</label>
                            <input
                                type='text'
                                value={formData.patientId}
                                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                className='w-full border rounded px-3 py-2'
                                placeholder='輸入病患 ID'
                                required
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-600 mb-1'>追蹤回診日期</label>
                            <input
                                type='date'
                                value={formData.followUpDate}
                                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                                className='w-full border rounded px-3 py-2'
                            />
                        </div>
                    </div>

                    <div className='mt-4'>
                        <label className='block text-sm font-medium text-gray-600 mb-1'>診斷 *</label>
                        <input
                            type='text'
                            value={formData.diagnosis}
                            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                            className='w-full border rounded px-3 py-2'
                            placeholder='例如：上呼吸道感染'
                            required
                        />
                    </div>

                    <div className='mt-4'>
                        <label className='block text-sm font-medium text-gray-600 mb-1'>症狀 (逗號分隔)</label>
                        <input
                            type='text'
                            value={formData.symptoms}
                            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                            className='w-full border rounded px-3 py-2'
                            placeholder='例如：咳嗽, 流鼻水, 發燒'
                        />
                    </div>

                    <div className='mt-4'>
                        <label className='block text-sm font-medium text-gray-600 mb-1'>治療方案</label>
                        <textarea
                            value={formData.treatment}
                            onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                            className='w-full border rounded px-3 py-2'
                            rows='2'
                            placeholder='例如：多休息、多喝水...'
                        />
                    </div>

                    {/* Prescription Section */}
                    <div className='mt-4'>
                        <div className='flex justify-between items-center mb-2'>
                            <label className='block text-sm font-medium text-gray-600'>處方藥物</label>
                            <button
                                type='button'
                                onClick={addPrescription}
                                className='text-primary text-sm hover:underline'
                            >
                                + 新增藥物
                            </button>
                        </div>
                        {formData.prescription.map((p, index) => (
                            <div key={index} className='grid grid-cols-4 gap-2 mb-2'>
                                <input
                                    type='text'
                                    placeholder='藥品名稱'
                                    value={p.medicine}
                                    onChange={(e) => updatePrescription(index, 'medicine', e.target.value)}
                                    className='border rounded px-2 py-1.5 text-sm'
                                />
                                <input
                                    type='text'
                                    placeholder='劑量'
                                    value={p.dosage}
                                    onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                                    className='border rounded px-2 py-1.5 text-sm'
                                />
                                <input
                                    type='text'
                                    placeholder='服用時間'
                                    value={p.duration}
                                    onChange={(e) => updatePrescription(index, 'duration', e.target.value)}
                                    className='border rounded px-2 py-1.5 text-sm'
                                />
                                <input
                                    type='text'
                                    placeholder='備註'
                                    value={p.notes}
                                    onChange={(e) => updatePrescription(index, 'notes', e.target.value)}
                                    className='border rounded px-2 py-1.5 text-sm'
                                />
                            </div>
                        ))}
                    </div>

                    <div className='mt-4'>
                        <label className='block text-sm font-medium text-gray-600 mb-1'>醫生備註</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className='w-full border rounded px-3 py-2'
                            rows='2'
                            placeholder='其他備註...'
                        />
                    </div>

                    <button
                        type='submit'
                        className='mt-4 bg-primary text-white px-8 py-2.5 rounded-full hover:bg-primary/90 transition-all'
                    >
                        建立病歷
                    </button>
                </form>
            )}

            {/* Records List */}
            <div className='bg-white rounded-lg shadow'>
                {loading ? (
                    <div className='p-8 text-center text-gray-500'>載入中...</div>
                ) : records.length === 0 ? (
                    <div className='p-8 text-center text-gray-500'>尚無病歷記錄</div>
                ) : (
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>病患</th>
                                    <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>診斷</th>
                                    <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>症狀</th>
                                    <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>建立日期</th>
                                    <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>回診日期</th>
                                    <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>操作</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y'>
                                {records.map((record) => (
                                    <tr key={record._id} className='hover:bg-gray-50'>
                                        <td className='px-4 py-3'>
                                            <div className='flex items-center gap-2'>
                                                <img
                                                    src={record.patientId?.image || '/default-avatar.png'}
                                                    alt=''
                                                    className='w-8 h-8 rounded-full object-cover'
                                                />
                                                <span className='text-sm'>{record.patientId?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className='px-4 py-3 text-sm font-medium text-gray-800'>
                                            {record.diagnosis}
                                        </td>
                                        <td className='px-4 py-3'>
                                            <div className='flex flex-wrap gap-1'>
                                                {record.symptoms?.slice(0, 3).map((s, i) => (
                                                    <span key={i} className='text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded'>
                                                        {s}
                                                    </span>
                                                ))}
                                                {record.symptoms?.length > 3 && (
                                                    <span className='text-xs text-gray-500'>+{record.symptoms.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className='px-4 py-3 text-sm text-gray-600'>
                                            {formatDate(record.createdAt)}
                                        </td>
                                        <td className='px-4 py-3 text-sm text-gray-600'>
                                            {record.followUpDate ? formatDate(record.followUpDate) : '-'}
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
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <p className='text-sm text-gray-500'>病患</p>
                                    <p className='font-medium'>{selectedRecord.patientId?.name || 'Unknown'}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>建立日期</p>
                                    <p className='font-medium'>{formatDate(selectedRecord.createdAt)}</p>
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MedicalRecords

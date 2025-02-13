import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  testCount: number;
  latestTestDate: string;
}

const DoctorDashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/doctor/patients');
        if (!response.ok) throw new Error('Failed to fetch patients');
        
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const columns: ColumnsType<Patient> = [
    {
      title: 'Name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Tests',
      dataIndex: 'testCount',
      sorter: (a, b) => a.testCount - b.testCount,
    },
    {
      title: 'Latest Test',
      dataIndex: 'latestTestDate',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'No tests',
      sorter: (a, b) => new Date(a.latestTestDate).getTime() - new Date(b.latestTestDate).getTime(),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Link to={`/patient-results/${record.id}`} className="text-indigo-600 hover:text-indigo-900">
          View History
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-[#f8f0ed]">
      <div className="font-semibold  mt-10">
        <p className="mb-4 pt-4">You have access to {patients.length} patient records</p>
        
        <Spin spinning={loading}>
          <Table className=''
            columns={columns}
            dataSource={patients}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Spin>
      </div>
    </div>
  );
};

export default DoctorDashboard;
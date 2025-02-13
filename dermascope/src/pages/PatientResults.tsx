import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Spin, Timeline, Image } from 'antd';
import { 
  ArrowLeft, Mail, FileText, 
  Calendar, Activity, User,
  TrendingDown, TrendingUp
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TimelineItemProps } from 'antd/es/timeline';

interface TestResult {
  id: number;
  testType: string;
  imageUrl: string;
  testResults: {
    prediction: string;
    confidence: number;
    detailed_scores?: number[];
    body_part: string;
  };
  createdAt: string;
  bodyPart: string;
}

interface Patient {
  firstName: string;
  lastName: string;
  email: string;
}

interface ChartData {
  date: string;
  severity: number;
}

const PatientResults = () => {
  const { patientId } = useParams();
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getChartData = (): ChartData[] => {
    return [...testResults]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map(result => ({
        date: new Date(result.createdAt).toLocaleDateString(),
        severity: calculateSeverity(result.testResults)
      }));
  };  

  const calculateSeverity = (testResults: TestResult['testResults']): number => {
    return testResults.confidence || 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const response = await fetch(`http://localhost:5000/api/patient-results/${patientId}`);
        if (!response.ok) throw new Error('Failed to fetch patient data');
        
        const data = await response.json();
        setPatientData(data.patient);
        setTestResults(data.testResults);
      } catch (error) {
        console.error(error);
        setError('Failed to load patient data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

  const items: TimelineItemProps[] = testResults.map(result => ({
    children: (
      <div className="p-4 bg-[#f8f0ed] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 font-inter">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-600" />
            <span className="text-base font-semibold">
              {new Date(result.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Activity size={16} />
            <span className="text-sm font-medium">
              Confidence: {result.testResults.confidence}%
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Image
            width="100%"
            src={result.imageUrl}
            alt="Test image"
            className="rounded-lg"
          />
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-medium">
              <FileText size={14} className="text-gray-600" />
              Test Type: {result.testType}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Activity size={14} className="text-indigo-600" />
              Body Part: {result.bodyPart}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Activity size={14} className="text-indigo-600" />
              Result: 
              <span className={`font-semibold ${
                result.testResults.prediction === 'Acne' 
                  ? 'text-red-500' 
                  : 'text-green-500'
              }`}>
                {result.testResults.prediction}
              </span>
            </p>
          </div>
        </div>
      </div>
    ),
  }));

  if (error) {
    return <div className="p-4 text-red-600 text-lg font-medium">{error}</div>;
  }

  return (
    <div className="p-4 bg-[#f8f0ed]">
      <Spin spinning={loading}>
        {patientData && (
          <div className="space-y-4 mt-20">
            <Card
              title={
                <div className="flex items-center gap-3 text-xl font-bold text-gray-800">
                  <User size={20} className="text-indigo-600" />
                  {`Patient History - ${patientData.firstName} ${patientData.lastName}`}
                </div>
              }
              extra={
                <Link 
                  to="/doctor-dashboard" 
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-900 font-medium transition-colors duration-200"
                >
                  <ArrowLeft size={16} />
                  Back to Dashboard
                </Link>
              }
              className="shadow-md font-inter bg-[#f8f0ed]"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Mail size={14} />
                    Email: {patientData.email}
                  </p>
                  <p className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <FileText size={14} />
                    Total Tests: 
                    <span className="text-indigo-600 font-semibold">
                      {testResults.length}
                    </span>
                  </p>
                </div>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        tick={{ fontSize: 12 }}
                        label={{ 
                          value: 'Severity Score', 
                          angle: -90, 
                          position: 'insideLeft',
                          fontSize: 12 
                        }}
                      />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="severity" 
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={{ fill: '#6366f1' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            <Timeline mode="alternate" className="mt-4">
              {items.map((item, index) => (
                <Timeline.Item key={index}>
                  {item.children}
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default PatientResults;
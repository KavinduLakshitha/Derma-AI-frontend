import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Spin, Timeline, Image } from 'antd';
import { 
  ArrowLeft, Mail, FileText, 
  Calendar, Activity, User
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TimelineItemProps } from 'antd/es/timeline';

interface TestResult {
  id: number;
  testType: string;
  imageUrl: string;
  testResults: {
    detected?: boolean;
    confidence: number;
    raw_predictions?: number[];
    severity?: {
      level: string;
      confidence: number;
    };
    severity_scores?: Record<string, number>;
    body_part?: string;
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
  severityValue: number;
  severityLabel: string;
}

// Severity level mapping
const SEVERITY_LEVELS = ["Clear", "Mild", "Moderate", "Severe"];
const getSeverityValue = (level: string): number => {
  return SEVERITY_LEVELS.indexOf(level) !== -1 ? 
    SEVERITY_LEVELS.indexOf(level) : 
    (level === "No Acne" || level === "No Eczema" || level === "No Psoriasis") ? 0 : 1;
};

const PatientResults = () => {
  const { patientId } = useParams();
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getChartData = (): ChartData[] => {
    return [...testResults]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map(result => {
        const severityLevel = result.testResults.severity?.level || 
                             (result.testResults.detected ? `Mild` : `Clear`);
        return {
          date: new Date(result.createdAt).toLocaleDateString(),
          severityValue: getSeverityValue(severityLevel),
          severityLabel: severityLevel
        };
      });
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

  // Helper function to determine the result text
  const getResultText = (result: TestResult): string => {
    const { testType, testResults } = result;
    
    // If severity assessment was performed
    if (testResults.severity?.level) {
      return `${testType.charAt(0).toUpperCase() + testType.slice(1)} - ${testResults.severity.level}`;
    }
    
    // If only detection was performed
    if (testResults.detected !== undefined) {
      return testResults.detected 
        ? `${testType.charAt(0).toUpperCase() + testType.slice(1)} Detected` 
        : `No ${testType.charAt(0).toUpperCase() + testType.slice(1)} Detected`;
    }
    
    // Fallback
    return "Results Pending";
  };

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
                result.testResults.detected ? 'text-amber-500' : 'text-green-500'
              }`}>
                {getResultText(result)}
              </span>
            </p>
            {result.testResults.severity && (
              <p className="flex items-center gap-2 text-sm">
                <Activity size={14} className="text-orange-600" />
                Severity: 
                <span className={`font-semibold ${
                  result.testResults.severity.level === 'Severe' ? 'text-red-600' :
                  result.testResults.severity.level === 'Moderate' ? 'text-orange-500' :
                  result.testResults.severity.level === 'Mild' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {result.testResults.severity.level}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    ),
  }));

  if (error) {
    return <div className="p-4 text-red-600 text-lg font-medium">{error}</div>;
  }

  const customYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const value = payload.value;
    const severityLabel = SEVERITY_LEVELS[value] || "Unknown";
    
    return (
      <text x={x} y={y} dy={4} fontSize={12} textAnchor="end" fill="#666">
        {severityLabel}
      </text>
    );
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
          <p className="text-sm font-medium">{`Date: ${label}`}</p>
          <p className="text-sm font-medium text-indigo-600">
            {`Severity: ${payload[0].payload.severityLabel}`}
          </p>
        </div>
      );
    }
    return null;
  };

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
                        dataKey="severityValue"
                        domain={[0, 3]}
                        ticks={[0, 1, 2, 3]}
                        tick={customYAxisTick}
                      />
                      <Tooltip content={customTooltip} />
                      <Line 
                        type="monotone" 
                        dataKey="severityValue" 
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
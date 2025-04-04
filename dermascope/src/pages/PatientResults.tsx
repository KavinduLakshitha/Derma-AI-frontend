import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Spin, Tabs, Timeline, Image } from 'antd';
import { 
  ArrowLeft, Mail, FileText, 
  Calendar, Activity, User
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
  Clear?: number;
  Mild?: number;
  Moderate?: number;
  Severe?: number;
  'High Severe'?: number;
}

// Severity level mapping
const SEVERITY_LEVELS = ["Clear", "Mild", "Moderate", "Severe", "High Severe"];
const SEVERITY_COLORS = {
  "Clear": "#4caf50",
  "Mild": "#ffeb3b",
  "Moderate": "#ff9800",
  "Severe": "#f44336",
  "High Severe": "#7b1fa2"
};

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

  // Filter results by condition type
  const acneResults = testResults.filter(r => r.testType === 'acne');
  const eczemaResults = testResults.filter(r => r.testType === 'eczema');
  const psoriasisResults = testResults.filter(r => r.testType === 'psoriasis');

  const getChartData = (results: TestResult[]): ChartData[] => {
    return [...results]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map(result => {
        const severityLevel = result.testResults.severity?.level || 
                             (result.testResults.detected ? `Mild` : `Clear`);
        
        const chartData: ChartData = {
          date: new Date(result.createdAt).toLocaleDateString(),
          severityValue: getSeverityValue(severityLevel),
          severityLabel: severityLevel
        };
        
        if (result.testResults.severity_scores) {
          Object.entries(result.testResults.severity_scores).forEach(([level, score]) => {
            chartData[level as keyof typeof SEVERITY_COLORS] = score;
          });
        } else if (result.testResults.severity) {
          chartData[severityLevel as keyof typeof SEVERITY_COLORS] = result.testResults.severity.confidence;
        }
        
        return chartData;
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

  const getResultText = (result: TestResult): string => {
    const { testType, testResults } = result;
    
    if (testResults.severity?.level) {
      return `${testType.charAt(0).toUpperCase() + testType.slice(1)} - ${testResults.severity.level}`;
    }
    
    if (testResults.detected !== undefined) {
      return testResults.detected 
        ? `${testType.charAt(0).toUpperCase() + testType.slice(1)} Detected` 
        : `No ${testType.charAt(0).toUpperCase() + testType.slice(1)} Detected`;
    }
    
    return "Results Pending";
  };

  const createTimelineItems = (results: TestResult[]): TimelineItemProps[] => {
    return results.map(result => ({
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
                <Activity size={14} className="text-[#8B4513]" />
                Body Part: {result.bodyPart}
              </p>
              <p className="flex items-center gap-2 text-sm">
                <Activity size={14} className="text-[#8B4513]" />
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
              
              {result.testResults.severity_scores && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Severity Breakdown:</p>
                  <div className="space-y-1">
                    {Object.entries(result.testResults.severity_scores).map(([level, score]) => (
                      <div key={level} className="flex items-center justify-between text-xs">
                        <span>{level}:</span>
                        <div className="flex items-center">
                          <div 
                            className="h-2 rounded-full" 
                            style={{
                              width: `${Math.max(score, 5)}px`,
                              backgroundColor: SEVERITY_COLORS[level as keyof typeof SEVERITY_COLORS] || '#6366f1',
                              minWidth: '5px'
                            }}
                          />
                          <span className="ml-2">{score.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
    }));
  };

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
      // Sort severity scores from highest to lowest
      const sortedPayload = [...payload]
        .filter(p => SEVERITY_LEVELS.includes(p.name))
        .sort((a, b) => b.value - a.value);

      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
          <p className="text-sm font-medium">{`Date: ${label}`}</p>
          <p className="text-sm font-medium text-[#8B4513]">
            {`Primary: ${payload[0].payload.severityLabel}`}
          </p>
          <div className="mt-1">
            {sortedPayload.map(entry => (
              <p key={entry.name} className="text-xs flex justify-between" style={{ color: entry.color }}>
                <span>{entry.name}:</span>
                <span className="font-medium ml-2">{entry.value.toFixed(1)}%</span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Get unique severity levels actually present in data
  const getActiveSeverityLevels = (results: TestResult[]) => {
    const chartData = getChartData(results);
    const allLevels = new Set<string>();
    
    chartData.forEach(dataPoint => {
      SEVERITY_LEVELS.forEach(level => {
        if (dataPoint[level as keyof ChartData] !== undefined) {
          allLevels.add(level);
        }
      });
    });
    
    return Array.from(allLevels);
  };

  const renderConditionTab = (results: TestResult[], conditionName: string) => {
    if (results.length === 0) {
      return <div className="text-center py-8">No {conditionName} test results found</div>;
    }

    return (
      <div className="space-y-4">
        <div className="h-64 mt-4">
          <p className="text-sm font-medium mb-2">{conditionName} Severity Trends Over Time</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData(results)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[0, 100]}
                label={{ value: '%', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={customTooltip} />
              <Legend />
              {getActiveSeverityLevels(results).map(level => (
                <Line 
                  key={level}
                  type="monotone" 
                  dataKey={level}
                  name={level}
                  stroke={SEVERITY_COLORS[level as keyof typeof SEVERITY_COLORS] || '#6366f1'}
                  strokeWidth={2}
                  dot={{ fill: SEVERITY_COLORS[level as keyof typeof SEVERITY_COLORS] || '#6366f1' }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="h-32 mt-4">
          <p className="text-sm font-medium mb-2">{conditionName} Primary Severity Level</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData(results)}>
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
              <Tooltip />
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

        <Timeline mode="alternate" className="mt-4">
          {createTimelineItems(results).map((item, index) => (
            <Timeline.Item key={index}>
              {item.children}
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    );
  };

  return (
    <div className="p-4 bg-[#f8f0ed]">
      <Spin spinning={loading}>
        {patientData && (
          <div className="space-y-4 mt-20">
            <Card
              title={
                <div className="flex items-center gap-3 text-xl font-bold text-gray-800">
                  <User size={20} className="text-[#8B4513]" />
                  {`Patient History - ${patientData.firstName} ${patientData.lastName}`}
                </div>
              }
              extra={
                <Link 
                  to="/doctor-dashboard" 
                  className="flex items-center gap-2 text-white bg-[#8B4513] hover:bg-[#A0522D] hover:text-white px-3 py-1 rounded-md font-medium transition-colors duration-200"
                >
                  <ArrowLeft size={16} />
                  Back to Dashboard
                </Link>
              }
              className="shadow-md font-inter bg-white"
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-200 rounded-full">
                        <Mail size={16} className="text-[#8B4513]" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Email</p>
                        <p className="text-sm font-medium">{patientData.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-200 rounded-full">
                        <FileText size={16} className="text-[#8B4513]" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Total Tests</p>
                        <p className="text-sm font-medium">{testResults.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-200 rounded-full">
                        <Activity size={16} className="text-[#8B4513]" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Conditions</p>
                        <div className="flex flex-wrap gap-1">
                          {acneResults.length > 0 && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Acne</span>
                          )}
                          {eczemaResults.length > 0 && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Eczema</span>
                          )}
                          {psoriasisResults.length > 0 && (
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Psoriasis</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>                
                
                <Tabs defaultActiveKey="acne">
                  <Tabs.TabPane tab="Acne" key="acne" className="text-gray-700">
                    {renderConditionTab(acneResults, "Acne")}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Eczema" key="eczema">
                    {renderConditionTab(eczemaResults, "Eczema")}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Psoriasis" key="psoriasis">
                    {renderConditionTab(psoriasisResults, "Psoriasis")}
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </Card>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default PatientResults;
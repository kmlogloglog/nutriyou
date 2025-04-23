import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { format } from 'date-fns';
import { Send, User, Clock, Activity, Scale, Target } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Initialize Google AI
const genAI = new GoogleGenerativeAI('AIzaSyD1f4zHLLPAsgGyP9YZhvxEwkuPh7O4yV0');

interface Assessment {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  height: number;
  current_weight: number;
  goal_weight?: number;
  activity_level: string;
  primary_goals: string[];
  dietary_restrictions?: string[];
  medical_conditions?: string[];
  created_at: string;
  status: string;
}

const ProductionPage = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [planContent, setPlanContent] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [aiChat, setAiChat] = useState<{ role: string; content: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('nutrition_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentSelect = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setAiChat([{
      role: 'system',
      content: `You are a nutrition expert assistant. The client's details:
        Name: ${assessment.full_name}
        Age: ${assessment.age}
        Gender: ${assessment.gender}
        Current Weight: ${assessment.current_weight}kg
        Goal Weight: ${assessment.goal_weight || 'Not specified'}kg
        Activity Level: ${assessment.activity_level}
        Goals: ${assessment.primary_goals.join(', ')}
        Dietary Restrictions: ${assessment.dietary_restrictions?.join(', ') || 'None'}
        Medical Conditions: ${assessment.medical_conditions?.join(', ') || 'None'}`
    }]);
  };

  const sendToAI = async () => {
    if (!aiMessage.trim()) return;

    try {
      setChatLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const newChat = [...aiChat, { role: 'user', content: aiMessage }];
      setAiChat(newChat);
      setAiMessage('');

      const result = await model.generateContent(aiMessage);
      const response = await result.response;
      const text = response.text();
      
      setAiChat([...newChat, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error('Error with AI chat:', error);
    } finally {
      setChatLoading(false);
    }
  };

  const filteredAssessments = assessments.filter(assessment =>
    assessment.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-[calc(100vh-80px)] flex">
      {/* Left Sidebar - Assessment List */}
      <div className="w-64 border-r border-gray-200 bg-white overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredAssessments.map((assessment) => (
            <div
              key={assessment.id}
              onClick={() => handleAssessmentSelect(assessment)}
              className={`p-3 cursor-pointer transition-colors border-b border-gray-100 ${
                selectedAssessment?.id === assessment.id
                  ? 'bg-primary-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {assessment.full_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(assessment.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedAssessment ? (
          <>
            {/* Client Details Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedAssessment.full_name}
                  </h2>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedAssessment.age} years
                    </span>
                    <span className="flex items-center">
                      <Activity className="w-4 h-4 mr-1" />
                      {selectedAssessment.activity_level}
                    </span>
                    <span className="flex items-center">
                      <Scale className="w-4 h-4 mr-1" />
                      {selectedAssessment.current_weight}kg
                    </span>
                    {selectedAssessment.goal_weight && (
                      <span className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        {selectedAssessment.goal_weight}kg
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                    {selectedAssessment.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden p-4 gap-4">
              {/* Plan Editor */}
              <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Nutrition Plan</h3>
                </div>
                <div className="flex-1 p-4">
                  <textarea
                    className="w-full h-full p-4 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={planContent}
                    onChange={(e) => setPlanContent(e.target.value)}
                    placeholder="Write the nutrition plan here..."
                  />
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="btn btn-primary text-sm">
                    Save Plan
                  </button>
                </div>
              </div>

              {/* AI Assistant */}
              <div className="w-96 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">AI Assistant</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {aiChat.map((msg, index) => (
                    msg.role !== 'system' && (
                      <div
                        key={index}
                        className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`rounded-lg py-2 px-3 max-w-[80%] ${
                            msg.role === 'assistant'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-primary-100 text-primary-800'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    )
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-2">
                        <LoadingSpinner size="sm" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask the AI assistant..."
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md"
                      value={aiMessage}
                      onChange={(e) => setAiMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendToAI()}
                    />
                    <button
                      onClick={sendToAI}
                      disabled={!aiMessage.trim() || chatLoading}
                      className="btn btn-primary px-3 py-1.5"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select an assessment to create a plan
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionPage;
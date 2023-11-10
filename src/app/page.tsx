'use client'
import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as qna from '@tensorflow-models/qna';
import { Hourglass } from 'react-loader-spinner';

export default function Home() {
  const passageRef = useRef<HTMLTextAreaElement | null>(null);
  const questionRef = useRef<HTMLInputElement | null>(null);
  const [answer, setAnswer] = useState<string | undefined>(undefined);
  const [model, setModel] = useState<qna.QuestionAndAnswer | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  const loadModel = async () => {
    await tf.ready();
    const loadedModel = await qna.load();
    setModel(loadedModel);
    setIsLoading(false); 
    console.log('Model loaded.');
  };

  const answerQuestion = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.keyCode === 13) && model !== null) {
      console.log('Question submitted.');
      const passage = passageRef.current?.value || '';
      const question = questionRef.current?.value || '';

      const answers = await model.findAnswers(question, passage);
      const answerText = answers.length > 0 ? answers[0].text : '';
      setAnswer(answerText);
      console.log(answers);
    }
  };

  useEffect(() => {
    loadModel();
  }, []);


  const pStyle: React.CSSProperties = {
    marginBottom:'10px',
    fontSize:'50px'
  }

  const loadingStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh', 
  }

  const pageStyle:React.CSSProperties = {
    backgroundColor: '#78C1F3',
    height:'100vh',
  }


  return (
    <div style={pageStyle}>
      {isLoading ? (
        <div style={loadingStyle}>
          <p style={pStyle}>Please wait! The Model is Loading...</p>
          <Hourglass />
        </div>
      ) : (
        <div className="flex flex-col">
          <textarea className="text-gray-700 bg-gray-100 px-4 py-2 mt-2 ml-6 mr-6" ref={passageRef} rows={4} cols={50} placeholder="Enter the passage" />

          <input className="text-gray-700 bg-gray-100  px-4 py-2 mt-2 ml-6 mr-6" ref={questionRef} onKeyDown={answerQuestion} placeholder="Ask a question(Press Enter when done!)" />
          
          <div className="text-gray-700 bg-gray-100  px-4 py-2 mt-2 ml-6 mr-6 ">Answer: {answer || ''}</div>
        </div>
      )}
    </div>
  );
}

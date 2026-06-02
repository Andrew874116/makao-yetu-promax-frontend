// ============================================================
// REAL-TIME CHAT SYSTEM - Instagram/Direct Messages style
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const API = 'https://makao-yetu-promax.onrender.com';
const SOCKET_URL = 'https://makao-yetu-promax.onrender.com';

export default function Chat() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [startingChat, setStartingChat] = useState(false);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('user_id');

  // ============================================================
  // INITIALIZE SOCKET CONNECTION
  // ============================================================
  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }
    
    // Connect to socket
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      upgrade: false
    });
    
    socketRef.current.on('connect', () => {
      console.log('Connected to chat server');
    });
    
    socketRef.current.on('new_message', (message) => {
      // Refresh conversations to update last message
      fetchConversations();
      
      // If this message belongs to current open chat, add it
      if (selectedChat && 
          ((message.sender_id === selectedChat.other_user_id && message.receiver_id === parseInt(currentUserId)) ||
           (message.sender_id === parseInt(currentUserId) && message.receiver_id === selectedChat.other_user_id))) {
        setMessages(prev => [...prev, message]);
      }
    });
    
    fetchConversations();
    
    // Check if we need to start a new chat with an agent
    const startChatWith = localStorage.getItem('chat_with_agent');
    if (startChatWith) {
      const agent = JSON.parse(startChatWith);
      localStorage.removeItem('chat_with_agent');
      startNewChat(agent.agent_id, agent.agent_name, agent.property_id);
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token, currentUserId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ============================================================
  // START A NEW CHAT CONVERSATION
  // ============================================================
  const startNewChat = async (agentId, agentName, propertyId) => {
    setStartingChat(true);
    
    // Create a temporary conversation object
    const tempConversation = {
      other_user_id: agentId,
      other_user_name: agentName,
      other_user_verified: true,
      property_id: propertyId,
      last_message: 'Start a conversation...',
      last_message_time: new Date().toISOString(),
      unread_count: 0
    };
    
    setSelectedChat(tempConversation);
    setConversations(prev => [tempConversation, ...prev]);
    
    // Join the chat room
    if (socketRef.current) {
      socketRef.current.emit('join_chat', {
        user_id: parseInt(currentUserId),
        other_user_id: agentId
      });
    }
    
    setStartingChat(false);
  };

  // ============================================================
  // FETCH CONVERSATIONS
  // ============================================================
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API}/api/my_conversations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FETCH MESSAGES FOR SELECTED CHAT
  // ============================================================
  const fetchMessages = async (otherUserId, propertyId = null) => {
    try {
      let url = `${API}/api/chat_messages/${otherUserId}`;
      if (propertyId) {
        url += `?property_id=${propertyId}`;
      }
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setMessages(data);
      
      // Join chat room
      if (socketRef.current) {
        socketRef.current.emit('join_chat', {
          user_id: parseInt(currentUserId),
          other_user_id: otherUserId
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // ============================================================
  // SEND MESSAGE
  // ============================================================
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    setSending(true);
    const messageText = newMessage;
    setNewMessage('');
    
    // Add message to UI immediately (optimistic update)
    const tempMessage = {
      id: Date.now(),
      sender_id: parseInt(currentUserId),
      receiver_id: selectedChat.other_user_id,
      message: messageText,
      created_at: new Date().toISOString(),
      is_read: false,
      is_temp: true
    };
    setMessages(prev => [...prev, tempMessage]);
    
    // Send via socket
    socketRef.current.emit('send_message', {
      sender_id: parseInt(currentUserId),
      receiver_id: selectedChat.other_user_id,
      message: messageText,
      property_id: selectedChat.property_id || null
    });
    
    setSending(false);
    
    // Refresh conversations list after a moment
    setTimeout(() => fetchConversations(), 500);
  };

  // ============================================================
  // SELECT A CHAT CONVERSATION
  // ============================================================
  const selectChat = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat.other_user_id, chat.property_id);
  };

  // ============================================================
  // FORMAT TIME
  // ============================================================
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 86400000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading && conversations.length === 0 && !startingChat) {
    return (
      <div style={{ background: '#0D0D2B', minHeight: '100vh', padding: '2rem', textAlign: 'center', color: 'white' }}>
        Loading conversations...
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div style={{ background: '#0D0D2B', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
        
        {/* Back Button */}
        <Link to="/" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: 'rgba(255,255,255,.1)', 
          border: '1px solid #2E2E5E', 
          padding: '8px 16px', 
          borderRadius: '40px', 
          color: 'white', 
          textDecoration: 'none', 
          marginBottom: '1rem' 
        }}>
          ← Back to Home
        </Link>
        
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#F5D200', marginBottom: '1rem' }}>
          💬 Messages
        </h1>
        
        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '1rem', minHeight: '550px' }}>
          
          {/* LEFT: Conversations List */}
          <div style={{ 
            background: '#1A1A3E', 
            borderRadius: '16px', 
            border: '1px solid #2E2E5E',
            overflow: 'hidden'
          }}>
            <div style={{ 
              padding: '1rem', 
              borderBottom: '1px solid #2E2E5E', 
              background: '#0D0D2B',
              fontWeight: 'bold',
              color: '#F5D200'
            }}>
              📋 Conversations ({conversations.length})
            </div>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {conversations.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,.5)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💬</div>
                  <p>No conversations yet.</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Click "Message Agent" on any property to start chatting!
                  </p>
                </div>
              ) : (
                conversations.map((chat, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectChat(chat)}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #2E2E5E',
                      cursor: 'pointer',
                      background: selectedChat?.other_user_id === chat.other_user_id ? 'rgba(230,48,48,.15)' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: '#F5D200' }}>{chat.other_user_name}</strong>
                        {chat.other_user_verified === 1 && (
                          <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: '#4CAF50' }}>✅</span>
                        )}
                      </div>
                      {chat.unread_count > 0 && (
                        <span style={{
                          background: '#E63030',
                          color: 'white',
                          borderRadius: '20px',
                          padding: '2px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}>
                          {chat.unread_count}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,.5)', marginTop: '4px' }}>
                      {chat.last_message?.substring(0, 40)}{chat.last_message?.length > 40 ? '...' : ''}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,.3)', marginTop: '2px' }}>
                      {formatTime(chat.last_message_time)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* RIGHT: Chat Messages Area */}
          <div style={{ 
            background: '#1A1A3E', 
            borderRadius: '16px', 
            border: '1px solid #2E2E5E',
            display: 'flex',
            flexDirection: 'column',
            height: '550px'
          }}>
            {!selectedChat ? (
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'rgba(255,255,255,.5)',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <span style={{ fontSize: '3rem' }}>💬</span>
                <p>Select a conversation to start chatting</p>
                <p style={{ fontSize: '0.8rem' }}>Or go to any property and click "Message Agent"</p>
                <Link to="/" style={{
                  background: '#E63030',
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  marginTop: '1rem'
                }}>
                  Browse Properties
                </Link>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid #2E2E5E',
                  background: '#0D0D2B',
                  borderRadius: '16px 16px 0 0'
                }}>
                  <strong style={{ color: '#F5D200', fontSize: '1rem' }}>{selectedChat.other_user_name}</strong>
                  {selectedChat.other_user_verified === 1 && (
                    <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: '#4CAF50' }}>Verified Agent</span>
                  )}
                </div>
                
                {/* Messages Area */}
                <div style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {messages.length === 0 ? (
                    <div style={{ 
                      textAlign: 'center', 
                      color: 'rgba(255,255,255,.5)', 
                      marginTop: '2rem' 
                    }}>
                      No messages yet. Send a message to start the conversation!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          display: 'flex',
                          justifyContent: msg.sender_id === parseInt(currentUserId) ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div style={{
                          maxWidth: '70%',
                          padding: '10px 14px',
                          borderRadius: '18px',
                          background: msg.sender_id === parseInt(currentUserId) ? '#E63030' : '#0D0D2B',
                          color: 'white',
                          fontSize: '0.85rem',
                          wordWrap: 'break-word'
                        }}>
                          {msg.message}
                          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,.5)', marginTop: '4px' }}>
                            {formatTime(msg.created_at)}
                            {msg.sender_id === parseInt(currentUserId) && (
                              <span style={{ marginLeft: '4px' }}>
                                {msg.is_read ? '✓✓' : '✓'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <div style={{ 
                  padding: '1rem', 
                  borderTop: '1px solid #2E2E5E',
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: '#0D0D2B',
                      border: '1px solid #2E2E5E',
                      borderRadius: '40px',
                      color: 'white',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                    style={{
                      padding: '12px 24px',
                      background: '#E63030',
                      border: 'none',
                      borderRadius: '40px',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {sending ? '...' : 'Send'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
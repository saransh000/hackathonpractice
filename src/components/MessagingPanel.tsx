import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
    email: string;
  };
  recipient: {
    _id: string;
    username: string;
    email: string;
  };
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  userId: string;
  username: string;
  email: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
}

const API_URL = 'http://172.26.81.221:5000/api';

export const MessagingPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUserList, setShowUserList] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages/unread-count`, axiosConfig);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages/conversations`, axiosConfig);
      setConversations(response.data.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Fetch available users
  const fetchAvailableUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages/users`, axiosConfig);
      setAvailableUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch conversation with specific user
  const fetchConversation = async (userId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/messages/conversation/${userId}`, axiosConfig);
      setMessages(response.data.data);
      setSelectedUser(userId);
      setShowUserList(false);
      await fetchUnreadCount();
      await fetchConversations();
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await axios.post(
        `${API_URL}/messages/send`,
        { recipientId: selectedUser, content: newMessage },
        axiosConfig
      );
      
      setMessages([...messages, response.data.data]);
      setNewMessage('');
      await fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (isOpen) {
      fetchUnreadCount();
      fetchConversations();
      if (selectedUser) {
        fetchConversation(selectedUser);
      }

      const interval = setInterval(() => {
        fetchUnreadCount();
        if (selectedUser) {
          fetchConversation(selectedUser);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isOpen, selectedUser]);

  const getSelectedUserInfo = () => {
    const conv = conversations.find(c => c.userId === selectedUser);
    if (conv) return conv;
    const user = availableUsers.find(u => u._id === selectedUser);
    return user ? { username: user.username, email: user.email } : null;
  };

  return (
    <>
      {/* Floating Message Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Messaging Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="font-poppins font-bold text-lg">Team Messages</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          {!selectedUser ? (
            // Conversations List
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <button
                  onClick={() => {
                    fetchAvailableUsers();
                    setShowUserList(!showUserList);
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-inter font-semibold hover:shadow-lg transition-all duration-300 mb-4"
                >
                  + New Message
                </button>

                {showUserList ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-poppins font-semibold text-gray-800 dark:text-gray-200">Select User</h4>
                      <button onClick={() => setShowUserList(false)} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {availableUsers.map(user => (
                      <div
                        key={user._id}
                        onClick={() => fetchConversation(user._id)}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="font-inter font-semibold text-gray-800 dark:text-gray-200">{user.username}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="font-poppins font-semibold text-gray-800 dark:text-gray-200 mb-3">Conversations</h4>
                    {conversations.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="font-inter">No messages yet</p>
                        <p className="text-sm">Start a conversation!</p>
                      </div>
                    ) : (
                      conversations.map(conv => (
                        <div
                          key={conv.userId}
                          onClick={() => fetchConversation(conv.userId)}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 relative"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {conv.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-inter font-semibold text-gray-800 dark:text-gray-200">{conv.username}</p>
                              <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(conv.lastMessageDate).toLocaleString()}
                              </p>
                            </div>
                            {conv.unreadCount > 0 && (
                              <span className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Chat View
            <>
              {/* Chat Header */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setMessages([]);
                  }}
                  className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {getSelectedUserInfo()?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-inter font-semibold text-gray-800 dark:text-gray-200">
                    {getSelectedUserInfo()?.username}
                  </p>
                  <p className="text-xs text-gray-500">{getSelectedUserInfo()?.email}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/50">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p className="font-inter">No messages yet</p>
                    <p className="text-sm">Send the first message!</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isSent = msg.sender._id === currentUser.id;
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[75%] ${isSent ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'} rounded-2xl px-4 py-2 shadow-md`}>
                          <p className="font-inter text-sm break-words">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isSent ? 'text-blue-100' : 'text-gray-500'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 font-inter"
                    maxLength={1000}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-inter font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

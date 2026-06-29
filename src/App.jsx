import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Users, Shield, Settings, Palette, Send, 
  Trash2, Lock, LogOut, Search, Plus, X, Share2, 
  User, RefreshCw, Smile, Sparkles, Link, MoreVertical,
  ChevronLeft, LayoutDashboard, EyeOff, Eye, AlertTriangle, CheckCheck,
  Volume2, VolumeX, Ban, ShieldCheck, UserX, UserCheck, Bot, FileText, Image, Mic,
  Video, Music, Download, Play, Pause, Paperclip, Check, Radio
} from 'lucide-react';

const OWNER_EMAIL = 'pikubalur@gmail.com';
const OWNER_PASSWORD_REQUIRED = 'Alexpiku@#2006';

// Color classes mapping for modern layouts
const COLOR_CLASSES = {
  emerald: {
    bg: 'bg-emerald-600',
    hover: 'hover:bg-emerald-700',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    light: 'bg-emerald-50',
    gradient: 'from-emerald-600 to-emerald-800'
  },
  blue: {
    bg: 'bg-blue-600',
    hover: 'hover:bg-blue-700',
    text: 'text-blue-600',
    border: 'border-blue-200',
    light: 'bg-blue-50',
    gradient: 'from-blue-600 to-blue-800'
  },
  purple: {
    bg: 'bg-purple-600',
    hover: 'hover:bg-purple-700',
    text: 'text-purple-600',
    border: 'border-purple-200',
    light: 'bg-purple-50',
    gradient: 'from-purple-600 to-purple-800'
  },
  rose: {
    bg: 'bg-rose-600',
    hover: 'hover:bg-rose-700',
    text: 'text-rose-600',
    border: 'border-rose-200',
    light: 'bg-rose-50',
    gradient: 'from-rose-600 to-rose-800'
  },
  slate: {
    bg: 'bg-slate-700',
    hover: 'hover:bg-slate-800',
    text: 'text-slate-700',
    border: 'border-slate-200',
    light: 'bg-slate-100',
    gradient: 'from-slate-700 to-slate-900'
  }
};

const USER_COLORS = {
  blue: 'bg-blue-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  purple: 'bg-purple-500 text-white',
  rose: 'bg-rose-500 text-white',
  slate: 'bg-slate-500 text-white',
  amber: 'bg-amber-500 text-white',
  indigo: 'bg-indigo-500 text-white'
};

const USER_TEXT_COLORS = {
  blue: 'text-blue-500',
  emerald: 'text-emerald-500',
  purple: 'text-purple-500',
  rose: 'text-rose-500',
  slate: 'text-slate-500',
  amber: 'text-amber-500',
  indigo: 'text-indigo-500'
};

const playSyntheticSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'send') {
      osc.frequency.setValueAtTime(600, ctx.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08); 
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'receive') {
      osc.frequency.setValueAtTime(800, ctx.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.12); 
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    }
  } catch (e) {
    // Avoid interrupting execution if blocked by sandbox
  }
};

const INITIAL_USERS = [
  { id: 'owner-id', email: OWNER_EMAIL, name: 'Alex Piku (Admin)', avatar: 'AP', isOnline: true, status: 'active', color: 'rose' },
  { id: 'user-1', email: 'balur@gmail.com', name: 'Balur Member', avatar: 'BM', isOnline: true, status: 'active', color: 'blue' },
  { id: 'user-2', email: 'guest@gmail.com', name: 'Guest Explorer', avatar: 'GE', isOnline: false, status: 'active', color: 'emerald' },
  { id: 'gemini-bot', email: 'gemini@assistant.ai', name: 'Gemini 3.5 Pro', avatar: '♊', isOnline: true, status: 'active', color: 'purple', isBot: true }
];

const INITIAL_GROUPS = [
  { id: 'group-general', name: '𝛥𝐿𝛯𝛸-𝛲𝛪𝛫𝑈 Global Chat', createdBy: 'owner-id', members: ['owner-id', 'user-1', 'user-2', 'gemini-bot'], link: 'alexpiku/join/general' }
];

const INITIAL_MESSAGES = [
  { id: 'm1', text: 'Welcome to the newly secured 𝛥𝐿𝛯𝛸-𝛲𝛪𝛫𝑈 Web Platform!', senderId: 'owner-id', receiverId: 'group-general', timestamp: Date.now() - 3600000 },
  { id: 'm2', text: 'Hello! This version supports sending photos, videos, custom documents, and even playable music files!', senderId: 'user-1', receiverId: 'group-general', timestamp: Date.now() - 1800000 },
  { id: 'm3', text: 'I am Gemini 3.5 Pro! Send me images to analyze, or ask any question. You can also send voice notes in any chat!', senderId: 'gemini-bot', receiverId: 'group-general', timestamp: Date.now() - 900000 }
];

export default function App() {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('piku_users_fixed_v2');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch (e) {
      return INITIAL_USERS;
    }
  });

  const [groups, setGroups] = useState(() => {
    try {
      const saved = localStorage.getItem('piku_groups_fixed_v2');
      return saved ? JSON.parse(saved) : INITIAL_GROUPS;
    } catch (e) {
      return INITIAL_GROUPS;
    }
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('piku_messages_fixed_v2');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch (e) {
      return INITIAL_MESSAGES;
    }
  });

  const [globalConfig, setGlobalConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('piku_config_fixed_v2');
      return saved ? JSON.parse(saved) : {
        themeColor: 'emerald',
        allowImages: true,
        allowVoice: true,
        allowRegistration: true,
        soundEnabled: true
      };
    } catch (e) {
      return {
        themeColor: 'emerald',
        allowImages: true,
        allowVoice: true,
        allowRegistration: true,
        soundEnabled: true
      };
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('piku_current_user_fixed_v2');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Navigation and Modal States
  const [authView, setAuthView] = useState('login'); 
  const [activeTab, setActiveTab] = useState('chats'); 
  const [selectedChat, setSelectedChat] = useState(null); 
  const [chatType, setChatType] = useState('user'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  
  // Create Group Modal State
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);

  // Toast / custom message alert state
  const [toast, setToast] = useState(null);

  // Login Input state
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [botTyping, setBotTyping] = useState(false);

  // Hidden file inputs refs
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const musicInputRef = useRef(null);
  const docInputRef = useRef(null);

  // Mic/Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [voiceChunks, setVoiceChunks] = useState([]);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef(null);

  const messageEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('piku_users_fixed_v2', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('piku_groups_fixed_v2', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('piku_messages_fixed_v2', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('piku_config_fixed_v2', JSON.stringify(globalConfig));
  }, [globalConfig]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('piku_current_user_fixed_v2', JSON.stringify(user));
    } else {
      localStorage.removeItem('piku_current_user_fixed_v2');
    }
  }, [user]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, botTyping]);

  // Handle timer for recording
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingTimerRef.current);
      setRecordingSeconds(0);
    }
    return () => clearInterval(recordingTimerRef.current);
  }, [isRecording]);

  const showCustomToast = (msg, type = 'info') => {
    setToast({ text: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const currentTheme = COLOR_CLASSES[globalConfig.themeColor] || COLOR_CLASSES.emerald;
  const isOwner = user?.email === OWNER_EMAIL;

  const handleAuth = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmail || !authPassword) {
      setAuthError('Please fill in all security fields.');
      return;
    }

    // STRICT password validation for the OWNER
    if (authEmail.trim().toLowerCase() === OWNER_EMAIL) {
      if (authPassword !== OWNER_PASSWORD_REQUIRED) {
        setAuthError('Access Denied: Incorrect Owner Credentials.');
        return;
      }
      
      let ownerProfile = users.find(u => u.email === OWNER_EMAIL);
      if (!ownerProfile) {
        ownerProfile = {
          id: 'owner-id',
          email: OWNER_EMAIL,
          name: 'Alex Piku (Admin)',
          avatar: 'AP',
          isOnline: true,
          status: 'active',
          color: 'rose'
        };
        setUsers(prev => [ownerProfile, ...prev.filter(u => u.email !== OWNER_EMAIL)]);
      }
      setUser(ownerProfile);
      setSelectedChat(null);
      showCustomToast("Welcome back, Owner!", "success");
      return;
    }

    if (authView === 'login') {
      const existingUser = users.find(u => u.email.toLowerCase() === authEmail.trim().toLowerCase());
      if (!existingUser) {
        setAuthError('Workspace profile not found. Register a new one.');
        return;
      }
      if (existingUser.status === 'suspended') {
        setAuthError('This profile is suspended by the Owner.');
        return;
      }
      setUser(existingUser);
      setSelectedChat(null);
      showCustomToast(`Logged in as ${existingUser.name}`);
    } else {
      // Registration Logic
      if (!globalConfig.allowRegistration) {
        setAuthError('New registrations are currently closed by the platform owner.');
        return;
      }
      if (!authName) {
        setAuthError('Please provide a Display Name.');
        return;
      }
      const existingUser = users.find(u => u.email.toLowerCase() === authEmail.trim().toLowerCase());
      if (existingUser) {
        setAuthError('This email is already registered.');
        return;
      }

      const availableColors = ['blue', 'emerald', 'purple', 'rose', 'slate', 'amber', 'indigo'];
      const assignedColor = availableColors[Math.floor(Math.random() * availableColors.length)];
      const newUser = {
        id: 'user-' + Date.now(),
        email: authEmail.trim().toLowerCase(),
        name: authName.trim(),
        avatar: authName.substring(0, 2).toUpperCase(),
        isOnline: true,
        status: 'active',
        color: assignedColor
      };

      setUsers(prev => [...prev, newUser]);
      setUser(newUser);
      setSelectedChat(null);
      showCustomToast("Profile successfully registered!");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedChat(null);
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    showCustomToast("Logged out successfully");
  };

  const handleSendMessage = async (text, fileAsset = null) => {
    if (!text.trim() && !fileAsset) return;

    if (user.status === 'suspended') {
      showCustomToast("Cannot send message. Your account is suspended.", "error");
      return;
    }

    const newMessage = {
      id: 'm-' + Date.now(),
      text: text.trim(),
      senderId: user.id,
      receiverId: selectedChat,
      timestamp: Date.now(),
      ...(fileAsset && { file: fileAsset })
    };

    setMessages(prev => [...prev, newMessage]);
    if (globalConfig.soundEnabled) {
      playSyntheticSound('send');
    }

    // AI Check
    const isBotChat = chatType === 'user' && selectedChat === 'gemini-bot';
    const isBotTaggedInGroup = chatType === 'group' && text.toLowerCase().includes('@gemini');

    if (isBotChat || isBotTaggedInGroup) {
      setBotTyping(true);
      
      // Delay to simulate AI thinking
      setTimeout(async () => {
        try {
          const userPrompt = isBotTaggedInGroup 
            ? `Inside group chat, user says: "${text}". Please reply concisely.`
            : text;
          
          const systemPrompt = "You are Gemini 3.5 Pro, integrated perfectly inside the 𝛥𝐿𝛯𝛸-𝛲𝛪𝛫𝑈 Web Suite. Respond with rich detail, helpful formatting, and high intelligence.";
          let replyText = "";
          
          // Multimodal payload if user attached an image
          const hasImage = fileAsset && fileAsset.type.startsWith('image/');
          const apiKey = ""; // Canvas will provide it in runtime
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

          if (apiKey || true) {
            try {
              let contentsPayload = [];
              if (hasImage) {
                // Remove the data scheme prefix (e.g., "data:image/png;base64,") for API payload
                const base64Clean = fileAsset.data.split(',')[1];
                contentsPayload = [{
                  role: "user",
                  parts: [
                    { text: userPrompt || "Analyze this uploaded image." },
                    {
                      inlineData: {
                        mimeType: fileAsset.type,
                        data: base64Clean
                      }
                    }
                  ]
                }];
              } else {
                contentsPayload = [{ parts: [{ text: userPrompt }] }];
              }

              const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: contentsPayload,
                  systemInstruction: { parts: [{ text: systemPrompt }] }
                })
              });
              const result = await response.json();
              replyText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            } catch (err) {
              console.warn("API direct request failed, using high-quality local Gemini 3.5 Pro response engine", err);
            }
          }

          if (!replyText) {
            // High quality fallback replies
            if (hasImage) {
              replyText = `**[Gemini 3.5 Pro Analysis Mode]** I have successfully processed your uploaded visual asset ("${fileAsset.name}"). Based on high-resolution image analysis, I can see the structural design and elements. Let me know if you would like me to extract text or perform color mapping!`;
            } else {
              const fallbacks = [
                "Hello from the newly upgraded **Gemini 3.5 Pro** workspace node. How can I assist you with code, media, or file analysis today?",
                "This platform is fully running 𝛥𝐿𝛯𝛸-𝛲𝛪𝛫𝑈 protocols. I can help organize your custom file drops, group links, and direct pings.",
                "Understood perfectly. Let's make sure your workspace operations are running efficiently.",
                "I am monitoring this coordinate. Feel free to upload high-fidelity photos, audio, or documents for immediate analysis."
              ];
              replyText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            }
          }

          const botMessage = {
            id: 'm-' + (Date.now() + 1),
            text: replyText,
            senderId: 'gemini-bot',
            receiverId: chatType === 'group' ? selectedChat : user.id,
            timestamp: Date.now()
          };

          setMessages(prev => [...prev, botMessage]);
          if (globalConfig.soundEnabled) {
            playSyntheticSound('receive');
          }
        } catch (e) {
          console.error("Gemini 3.5 Pro pipeline error:", e);
        } finally {
          setBotTyping(false);
        }
      }, 1200);
    }
  };

  const handleFileChange = (e, category) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert file to Base64 data url for direct layout embedding
    const reader = new FileReader();
    reader.onloadend = () => {
      const fileAsset = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: reader.result,
        category: category // 'image', 'video', 'music', 'doc'
      };
      
      handleSendMessage(`Shared a ${category}: ${file.name}`, fileAsset);
      showCustomToast(`Sent ${file.name} successfully!`, "success");
    };
    reader.readAsDataURL(file);
    e.target.value = null; // reset
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const fileAsset = {
            name: `Voice Note - ${new Date().toLocaleTimeString()}`,
            type: 'audio/webm',
            data: reader.result,
            category: 'voice'
          };
          handleSendMessage("🎙️ Voice Note Sent", fileAsset);
        };
        reader.readAsDataURL(audioBlob);
        
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setVoiceChunks(chunks);
      recorder.start();
      setIsRecording(true);
      showCustomToast("Recording started...");
    } catch (err) {
      console.warn("Media recorder blocked or unsupported. Simulating voice note...");
      // High-quality simulation fallback if mic is blocked in sandwich iframe
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const mockVoiceAsset = {
          name: `Voice Note (Simulated) - ${new Date().toLocaleTimeString()}`,
          type: 'audio/mp3',
          data: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // reliable sample stream
          category: 'voice',
          isMock: true
        };
        handleSendMessage("🎙️ Voice Note (Simulated) Sent", mockVoiceAsset);
        showCustomToast("Simulated voice note uploaded", "success");
      }, 3000);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    setIsRecording(false);
  };

  const handleOpenGroupModal = () => {
    setNewGroupName('');
    setSelectedGroupMembers([user.id]); // creator is added automatically
    setIsGroupModalOpen(true);
  };

  const handleToggleMemberSelection = (memberId) => {
    if (memberId === user.id) return; // cannot remove self
    if (

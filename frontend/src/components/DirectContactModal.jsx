import React, { useState } from 'react';
import { Phone, MessageSquare, Send, X, Check, ShieldCheck, User, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const DirectContactModal = ({ contact, onClose, initialMode = 'message' }) => {
  const { isHindi } = useLanguage();
  const [activeTab, setActiveTab] = useState(initialMode); // 'call' or 'message'
  const [messages, setMessages] = useState([
    {
      sender: 'them',
      text: isHindi
        ? `नमस्ते! मैं ${contact?.name || 'किसान/खरीदार'} हूँ। फसल की गुणवत्ता व डिलीवरी से जुड़े किसी भी सवाल के लिए संपर्क कर सकते हैं।`
        : `Hello! I am ${contact?.name || 'Farmer/Buyer'}. Feel free to ask about harvest quality, volume discount, or dispatch schedule.`,
      time: '10:00 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);

  const cleanPhone = (contact?.phone || '+91 98234 11029').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(isHindi ? 'नमस्ते, एग्रीकनेक्ट (AgriConnect) से फसल खरीद के संबंध में बात करनी है।' : 'Hello, contacting you via AgriConnect regarding farm produce.')}`;

  const quickQuestions = isHindi ? [
    'क्या अभी 500 kg स्टॉक उपलब्ध है?',
    'दिल्ली / मुंबई मंडी तक डिलीवरी में कितना समय लगेगा?',
    'क्या थोक मात्रा पर थोड़ा भाव कम हो सकता है?',
    'फसल की कटाई कब की गई है?'
  ] : [
    'Is 500kg volume ready for immediate dispatch?',
    'What is the estimated delivery time to our mandi?',
    'Can you offer a bulk rate discount?',
    'When was this harvest batch picked?'
  ];

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      sender: 'me',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulated instant reply from farmer/buyer
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'them',
          text: isHindi
            ? `धन्यवाद आपके संदेश के लिए! जी हाँ, माल एकदम ताज़ा और ए-ग्रेड गुणवत्ता का है। मैं आपके ऑर्डर के अनुसार पैकेजिंग और लोडिंग करा दूँगा।`
            : `Thank you for your message! Yes, the harvest is Grade-A fresh. I will prepare packaging and coordinate vehicle loading accordingly.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  const copyNumber = () => {
    navigator.clipboard?.writeText(contact?.phone || '+91 98234 11029');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={contact?.avatar || '/images/ramesh.jpg'}
                  alt={contact?.name || 'Contact'}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white/50"
                  onError={(e) => { e.target.onerror = null; e.target.src = '/images/ramesh.jpg'; }}
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="font-extrabold text-base flex items-center space-x-1.5">
                  <span>{contact?.name || 'Ramesh Kumar'}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-300 inline" />
                </h3>
                <p className="text-white/80 text-xs">
                  {contact?.role || (isHindi ? 'सत्यापित किसान' : 'Verified Farmer')} · {contact?.location?.city || 'Nashik'}
                </p>
              </div>
            </div>

            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-4 bg-emerald-900/40 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('message')}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${activeTab === 'message' ? 'bg-white text-emerald-800 shadow' : 'text-emerald-100 hover:text-white'}`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isHindi ? 'सीधा संदेश (Chat)' : 'Direct Message'}</span>
            </button>
            <button
              onClick={() => setActiveTab('call')}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${activeTab === 'call' ? 'bg-white text-emerald-800 shadow' : 'text-emerald-100 hover:text-white'}`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isHindi ? 'फोन कॉल / WhatsApp' : 'Phone / WhatsApp'}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Direct Message Chat */}
        {activeTab === 'message' && (
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-72">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    m.sender === 'me'
                      ? 'bg-emerald-700 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-0.5 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="pt-3 pb-2 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInputText(q)}
                  className="px-2.5 py-1 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-800 rounded-lg text-[10px] font-medium border border-gray-200 whitespace-nowrap transition-colors flex-shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isHindi ? 'यहाँ संदेश लिखें...' : 'Type message here...'}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="submit"
                className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow transition-colors"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Call & WhatsApp */}
        {activeTab === 'call' && (
          <div className="p-6 space-y-4">
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-center space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{isHindi ? 'सीधा संपर्क नंबर' : 'Direct Contact Phone'}</span>
              <div className="text-xl font-extrabold text-emerald-800 tracking-wide">
                {contact?.phone || '+91 98234 11029'}
              </div>
              <p className="text-[11px] text-gray-500">
                {contact?.location?.address || `${contact?.location?.city || 'Nashik'}, ${contact?.location?.state || 'Maharashtra'}`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Direct Call Button */}
              <a
                href={`tel:${contact?.phone || '+919823411029'}`}
                className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-2 shadow-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{isHindi ? 'सीधा कॉल करें' : 'Call Directly'}</span>
              </a>

              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-2 shadow-sm transition-colors"
              >
                <span>💬 WhatsApp Chat</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <button
              onClick={copyNumber}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
              <span>{copied ? (isHindi ? 'नंबर कॉपी हो गया!' : 'Phone Number Copied!') : (isHindi ? 'नंबर क्लिपबोर्ड पर कॉपी करें' : 'Copy Number to Clipboard')}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

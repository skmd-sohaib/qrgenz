import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Palette, Sparkles, Download, Share2, ScanEye, Gift, Eye, CheckCircle2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { y: 50, opacity: 0, scale: 0.9 },
  show: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", bounce: 0.5, duration: 0.8 } 
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('link');
  const [inputValue, setInputValue] = useState('');
  const [secretMessage, setSecretMessage] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [theme, setTheme] = useState('000000'); // Hex for API
  const [themeName, setThemeName] = useState('Void');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Receiver Mode State
  const [isReceiverMode, setIsReceiverMode] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState('');
  const [isBoxOpened, setIsBoxOpened] = useState(false);

  useEffect(() => {
    document.title = "✨ QRGenZ | Aesthetic QR Code Maker ✨";
    
    const setMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMetaTag('description', 'QRGenZ - The free aesthetic QR code maker. Create scannable links, secret wish messages, and cute custom QR codes.');
    setMetaTag('keywords', 'QRGenZ, QR code generator, free QR code maker, secret message QR, GenZ QR code, aesthetic QR code');
    setMetaTag('og:title', '✨ QRGenZ | No Cap ✨', true);
    setMetaTag('og:description', 'Drop a link or spill some tea to generate the most aesthetic QR codes.', true);
    setMetaTag('google-site-verification', 'YOUR_VERIFICATION_CODE_HERE');
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    
    if (msg) {
      try {
        const decodedMsg = decodeURIComponent(escape(atob(msg)));
        setReceivedMessage(decodedMsg);
        setIsReceiverMode(true);
      } catch (e) {
        console.error("Could not decode message", e);
      }
    }
  }, []);

  const getCleanBaseUrl = () => {
    let url = window.location.href.split('?')[0];
    if (url.startsWith('blob:')) {
      url = url.substring(5); 
    }
    return url;
  };

  const generateQR = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let finalData = '';
      
      if (activeTab === 'link') {
        finalData = inputValue || 'https://example.com';
      } else {
        const encodedMsg = btoa(unescape(encodeURIComponent(secretMessage || 'No cap, you forgot to type a message!')));
        finalData = `${getCleanBaseUrl()}?msg=${encodedMsg}`;
      }

      const encodedData = encodeURIComponent(finalData);
      const newQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodedData}&color=${theme}&bgcolor=ffffff&margin=10`;
      
      setQrUrl(newQrUrl);
      setIsGenerating(false);
    }, 800); 
  };

  const downloadQR = async () => {
    if (!qrUrl) return;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'QRGenZ-Aesthetic-Code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleShare = async () => {
    if (!qrUrl) return;
    
    let linkToShare = activeTab === 'link' ? inputValue : `${getCleanBaseUrl()}?msg=${btoa(unescape(encodeURIComponent(secretMessage)))}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QRGenZ',
          text: 'I made this dope aesthetic QR code on QRGenZ! ✨',
          url: linkToShare,
        });
      } catch (err) {
        console.log('Share canceled', err);
      }
    } else {
      // Fallback for desktop: Copy to clipboard
      try {
        const textArea = document.createElement("textarea");
        textArea.value = linkToShare;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const testSecretWish = () => {
    if (!secretMessage) return;
    const encodedMsg = btoa(unescape(encodeURIComponent(secretMessage)));
    const finalUrl = `${getCleanBaseUrl()}?msg=${encodedMsg}`;
    window.open(finalUrl, '_blank');
  };

  const themes = [
    { name: 'Void', color: '000000', display: 'bg-black' },
    { name: 'Slime', color: '84cc16', display: 'bg-[#84cc16]' },
    { name: 'Barbie', color: 'ec4899', display: 'bg-[#ec4899]' },
    { name: 'Ocean', color: '0ea5e9', display: 'bg-[#0ea5e9]' },
    { name: 'Grape', color: '9333ea', display: 'bg-[#9333ea]' }
  ];

  if (isReceiverMode) {
    return (
      <div className="min-h-screen bg-[#e0c3fc] flex items-center justify-center p-4 font-sans overflow-hidden relative selection:bg-[#ffb6c1]">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <motion.div animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute top-10 left-10 text-5xl drop-shadow-lg">✨</motion.div>
          <motion.div animate={{ y: [0, 40, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute bottom-20 right-10 text-6xl drop-shadow-lg">💖</motion.div>
          <motion.div animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute top-1/4 right-1/4 text-4xl drop-shadow-lg">🎀</motion.div>
          <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4.5 }} className="absolute bottom-1/4 left-1/4 text-5xl drop-shadow-lg">💫</motion.div>
        </div>

        <AnimatePresence mode="wait">
          {!isBoxOpened ? (
            <motion.div
              key="box"
              initial={{ scale: 0, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 180, y: -200 }}
              whileHover={{ scale: 1.15, rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
              whileTap={{ scale: 0.8 }}
              onClick={() => setIsBoxOpened(true)}
              className="cursor-pointer flex flex-col items-center gap-6 z-10"
            >
              <motion.div 
                animate={{ y: [0, -20, 0] }} 
                transition={{ repeat: Infinity, duration: 1.5, type: "spring" }}
                className="text-9xl drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)]"
              >
                🎁
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="bg-white border-4 border-black px-8 py-3 rounded-full shadow-[8px_8px_0px_rgba(0,0,0,1)] text-2xl font-black uppercase tracking-widest text-[#ec4899]"
              >
                Tap to Open!
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ scale: 0, y: 100, rotate: -10 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.7, duration: 1 }}
              className="bg-white border-4 border-black p-8 md:p-10 rounded-[2rem] max-w-md w-full shadow-[16px_16px_0px_rgba(0,0,0,1)] text-center z-10 relative overflow-hidden"
            >
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
                className="text-7xl mb-6 drop-shadow-md"
              >
                💌
              </motion.div>
              <h1 className="text-3xl font-black mb-8 uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                A Secret Wish!
              </h1>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-[#f8f9fa] border-4 border-black p-6 rounded-2xl mb-8 relative transform -rotate-1 hover:rotate-0 transition-transform"
              >
                <div className="absolute -top-3 -left-3 text-2xl">📌</div>
                <p className="text-xl font-black text-gray-800 break-words whitespace-pre-wrap leading-relaxed">
                  {receivedMessage}
                </p>
              </motion.div>
              
              <motion.button 
                whileHover={{ scale: 1.05, translateY: -4 }}
                whileTap={{ scale: 0.95, translateY: 4, boxShadow: "none" }}
                onClick={() => window.location.href = window.location.pathname}
                className="w-full bg-[#fdfd96] border-4 border-black py-4 rounded-2xl font-black uppercase text-lg hover:bg-[#c1e1c1] transition-all shadow-[8px_8px_0px_rgba(0,0,0,1)]"
              >
                Make Your Own QRGenZ ✨
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#c1e1c1] p-4 md:p-8 font-sans selection:bg-[#ffb6c1] selection:text-black overflow-x-hidden">
      
      {/* Background Ticker Tape */}
      <div className="absolute top-0 left-0 w-full overflow-hidden bg-black text-[#fdfd96] py-2 border-b-4 border-black z-0 flex whitespace-nowrap">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
          className="font-black uppercase tracking-widest text-sm flex gap-10"
        >
           <span>✨ WELCOME TO QRGENZ ✨</span>
           <span>🐐 THE GOAT OF QR CODES 🐐</span>
           <span>💖 MAKE A SECRET WISH 💖</span>
           <span>🚀 DROP YOUR LINK 🚀</span>
           <span>✨ WELCOME TO QRGENZ ✨</span>
           <span>🐐 THE GOAT OF QR CODES 🐐</span>
           <span>💖 MAKE A SECRET WISH 💖</span>
           <span>🚀 DROP YOUR LINK 🚀</span>
        </motion.div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto pt-16"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="text-center relative z-10 mb-12">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="inline-block bg-white border-4 border-black px-10 py-5 rounded-full shadow-[12px_12px_0px_rgba(0,0,0,1)] rotate-[-2deg] transition-transform"
          >
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
              QRGenZ
            </h1>
          </motion.div>
          <div className="mt-8">
            <p className="text-xl font-bold bg-[#fdfd96] inline-block px-6 py-2 border-4 border-black rounded-xl transform rotate-1 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
              No cap, the most aesthetic QR maker. 💅
            </p>
          </div>
        </motion.header>

        {/* Main Workbench Container */}
        <motion.main variants={itemVariants} className="bg-white border-4 border-black rounded-[2.5rem] p-6 md:p-10 shadow-[20px_20px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-12 relative">
          
          {/* Left Panel: Inputs */}
          <div className="flex-1 space-y-8 z-10">
            {/* Tabs */}
            <div className="flex p-2 bg-gray-100 border-4 border-black rounded-2xl shadow-[6px_6px_0px_rgba(0,0,0,1)]">
              <button
                onClick={() => { setActiveTab('link'); setQrUrl(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase text-sm md:text-base transition-all ${
                  activeTab === 'link' ? 'bg-[#ffb6c1] border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] translate-y-[-2px]' : 'hover:bg-gray-200 text-gray-500 border-4 border-transparent'
                }`}
              >
                <Link size={20} /> Normal Link
              </button>
              <button
                onClick={() => { setActiveTab('secret'); setQrUrl(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase text-sm md:text-base transition-all ${
                  activeTab === 'secret' ? 'bg-[#fdfd96] border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] translate-y-[-2px]' : 'hover:bg-gray-200 text-gray-500 border-4 border-transparent'
                }`}
              >
                <Gift size={20} /> Secret Wish
              </button>
            </div>

            {/* Dynamic Input Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="space-y-4"
              >
                {activeTab === 'link' ? (
                  <div>
                    <label className="block font-black uppercase text-base mb-3 ml-2 flex items-center gap-2">
                      Drop your link here 🌐
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="url"
                      placeholder="https://tiktok.com/@yourusername"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full border-4 border-black rounded-2xl p-5 text-xl font-bold bg-[#f8f9fa] focus:outline-none focus:bg-[#e0c3fc] transition-all shadow-[8px_8px_0px_rgba(0,0,0,1)] placeholder:text-gray-400"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block font-black uppercase text-base mb-3 ml-2 flex items-center gap-2">
                      Spill the tea / Write a wish 💌
                    </label>
                    <motion.textarea
                      whileFocus={{ scale: 1.02 }}
                      placeholder="Type a secret message that only shows up when they scan it!"
                      value={secretMessage}
                      onChange={(e) => setSecretMessage(e.target.value)}
                      rows={4}
                      className="w-full border-4 border-black rounded-2xl p-5 text-xl font-bold bg-[#f8f9fa] focus:outline-none focus:bg-[#ffb6c1] transition-all shadow-[8px_8px_0px_rgba(0,0,0,1)] resize-none placeholder:text-gray-400"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Theme Picker */}
            <div>
              <label className="flex items-center gap-2 font-black uppercase text-base mb-4 ml-2">
                <Palette size={20} /> Pick a Vibe
              </label>
              <div className="flex gap-4 flex-wrap">
                {themes.map((t) => (
                  <motion.button
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    key={t.name}
                    onClick={() => { setTheme(t.color); setThemeName(t.name); }}
                    className={`w-14 h-14 rounded-full border-4 border-black ${t.display} transition-all ${
                      theme === t.color ? 'shadow-[6px_6px_0px_rgba(0,0,0,1)] scale-110 ring-4 ring-offset-4 ring-black' : 'hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]'
                    }`}
                    title={t.name}
                  />
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "12px 12px 0px #ec4899" }}
              whileTap={{ scale: 0.95, boxShadow: "0px 0px 0px #ec4899", translateY: "12px", translateX: "12px" }}
              onClick={generateQR}
              className="w-full bg-black text-white font-black uppercase text-2xl py-6 rounded-2xl flex items-center justify-center gap-4 shadow-[8px_8px_0px_#ec4899] border-4 border-black transition-all relative overflow-hidden"
            >
              {isGenerating ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
                  <ScanEye size={32} />
                </motion.div>
              ) : (
                <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }}>
                  <Sparkles size={32} className="text-[#fdfd96]" />
                </motion.div>
              )}
              {isGenerating ? 'Cooking... 🍳' : 'Generate QR ✨'}
            </motion.button>
          </div>

          {/* Right Panel: Preview Area */}
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 border-4 border-black rounded-[2rem] p-8 relative overflow-hidden border-dashed">
            {/* Background Blob Effects */}
            <motion.div 
              animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="absolute top-0 right-0 w-48 h-48 bg-[#fdfd96] rounded-full mix-blend-multiply blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2"
            />
            <motion.div 
              animate={{ rotate: -360, scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="absolute bottom-0 left-0 w-48 h-48 bg-[#0ea5e9] rounded-full mix-blend-multiply blur-3xl opacity-40 -translate-x-1/2 translate-y-1/2"
            />

            <h3 className="font-black uppercase text-2xl mb-8 bg-white px-6 py-2 border-4 border-black rounded-full shadow-[6px_6px_0px_rgba(0,0,0,1)] z-10 transform -rotate-2">
              Live Preview
            </h3>

            <div className="bg-white p-5 border-4 border-black rounded-3xl shadow-[12px_12px_0px_rgba(0,0,0,1)] mb-10 z-10 h-72 w-72 flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                {qrUrl ? (
                  <motion.img
                    key="qr"
                    initial={{ scale: 0, rotate: -90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
                    src={qrUrl}
                    alt="Generated QR Code"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <motion.div 
                    key="placeholder"
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="text-gray-300 flex flex-col items-center gap-4"
                  >
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                      <ScanEye size={64} />
                    </motion.div>
                    <p className="font-black uppercase text-base tracking-widest text-center">Ready to <br/>cook</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 w-full z-10">
              <motion.button
                whileHover={{ scale: qrUrl ? 1.05 : 1 }}
                whileTap={{ scale: qrUrl ? 0.95 : 1 }}
                onClick={downloadQR}
                disabled={!qrUrl}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-4 border-black font-black uppercase text-sm md:text-base transition-all ${
                  qrUrl 
                    ? 'bg-white hover:bg-[#c1e1c1] shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[6px]' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                <Download size={20} /> Save
              </motion.button>
              
              {/* Contextual Action Button based on Tab */}
              {activeTab === 'secret' ? (
                <motion.button
                  whileHover={{ scale: qrUrl ? 1.05 : 1 }}
                  whileTap={{ scale: qrUrl ? 0.95 : 1 }}
                  onClick={testSecretWish}
                  disabled={!qrUrl}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-4 border-black font-black uppercase text-sm md:text-base transition-all ${
                    qrUrl 
                      ? 'bg-[#0ea5e9] text-white hover:bg-[#38bdf8] shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[6px]' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  <Eye size={20} /> Test It! 🪄
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: qrUrl ? 1.05 : 1 }}
                  whileTap={{ scale: qrUrl ? 0.95 : 1 }}
                  onClick={handleShare}
                  disabled={!qrUrl}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-4 border-black font-black uppercase text-sm md:text-base transition-all ${
                    qrUrl 
                      ? 'bg-[#e0c3fc] hover:bg-[#d8b4fe] shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[6px]' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  {isCopied ? <CheckCircle2 size={20} /> : <Share2 size={20} />} 
                  {isCopied ? 'Copied!' : 'Share'}
                </motion.button>
              )}
            </div>
          </div>
        </motion.main>

        {/* SEO / FAQ Section */}
        <motion.section 
          variants={itemVariants}
          className="mt-16 bg-white border-4 border-black rounded-[2rem] p-8 md:p-12 shadow-[16px_16px_0px_rgba(0,0,0,1)] text-left mb-12 relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 text-9xl opacity-10 rotate-12">🐐</div>
          
          <h2 className="text-4xl font-black mb-8 uppercase tracking-widest inline-block relative">
            Why QRGenZ is Goated 🐐
            <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#fdfd96] -z-10 transform -rotate-1"></div>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6 relative z-10">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-[#f8f9fa] p-6 border-4 border-black rounded-2xl shadow-[6px_6px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black uppercase bg-[#ffb6c1] inline-block px-3 py-1 border-4 border-black rounded-xl mb-4 transform -rotate-2">
                What is this?
              </h3>
              <p className="font-bold text-gray-800 leading-relaxed text-lg">
                QRGenZ is a free, aesthetic, and fully custom <strong>QR Code Generator</strong>. Whether you need to share a TikTok, a Spotify playlist, or a secret, our dynamic QR code maker generates it instantly. 
              </p>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} className="bg-[#f8f9fa] p-6 border-4 border-black rounded-2xl shadow-[6px_6px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black uppercase bg-[#e0c3fc] inline-block px-3 py-1 border-4 border-black rounded-xl mb-4 transform rotate-2">
                Secret Wish 💌
              </h3>
              <p className="font-bold text-gray-800 leading-relaxed text-lg">
                The <strong>Secret Message QR Code</strong> feature lets you encode a hidden message. When your bestie scans it, they get a bouncy, animated gift box surprise! Perfect for birthdays and cute moments.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer Credit */}
        <motion.footer 
          variants={itemVariants}
          className="text-center pb-12 pt-4"
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -2 }}
            className="inline-block bg-white px-8 py-4 border-4 border-black rounded-full shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[8px] hover:translate-x-[8px] transition-all cursor-crosshair"
          >
            <p className="font-black uppercase tracking-widest text-lg">
              Created with 💖 by <span className="text-[#ec4899] underline decoration-4 underline-offset-4">sk md sohaib</span> 🚀
            </p>
          </motion.div>
        </motion.footer>

      </motion.div>
    </div>
  );
}

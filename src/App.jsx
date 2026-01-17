import { useState, useEffect } from 'react';
import { darktideData } from './data/darktideData';
import { FaTwitch, FaYoutube } from 'react-icons/fa';
import './App.css';

function App() {
  const [loadout, setLoadout] = useState({
    class: null,
    primary: null,
    secondary: null,
    ability: null,
    blitz: null,
    keystone: null
  });

  const [history, setHistory] = useState([]);
  const [showGif, setShowGif] = useState(false);
  const [gifUrl, setGifUrl] = useState('');

  const gifOptions = [
    '/data/aba-guilty-gear.gif',
    '/data/ivydanceswag.gif'
  ];

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('darktideHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('darktideHistory', JSON.stringify(history));
  }, [history]);

  const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const handleMonsoonificationClick = () => {
    console.log('clicked!');
    
    const randomIndex = Math.floor(Math.random() * gifOptions.length);
    const randomGif = gifOptions[randomIndex];
    
    console.log('Selected GIF:', randomGif);
    
    setGifUrl(randomGif);
    setShowGif(true);
    
    setTimeout(() => {
      console.log('Auto-hiding GIF');
      setShowGif(false);
    }, 5000);
  };

  const handleGifClose = () => {
    setShowGif(false);
  };

  // Ability data
  const combatAbilities = {
    "Veteran": ["Executioner's Stance", "Voice of Command", "Infiltrate"],
    "Zealot": ["Fury of the Faithful", "Chorus of Spiritual Fortitude", "Shroudfield"],
    "Psyker": ["Venting Shriek", "Telekine Shield", "Scier's Gaze"],
    "Ogryn": ["Indomitable", "Loyal Protector", "Point-Blank Barrage"],
    "Arbitrator": ["Castigator's Stance", "Nuncio-Aquila", "Break the Line"],
    "Hive Scum": ["Enhanced Desperado", "Rampage!", "Stimm Supply"],
  };

  const blitzAbilities = {
    "Veteran": ["Shedder Frag Grenade", "Krak Grenade", "Smoke Grenade"],
    "Zealot": ["Stunstorm Grenade", "Immolation Grenade", "Blades of Faith"],
    "Psyker": ["Brain Rupture", "Smite", "Assail"],
    "Ogryn": ["Big Friendly Rock", "Frag Bomb", "Bombs Away!"],
    "Arbitrator": ["Remote Detonation", "Voltaic Shock Mine", "Arbites Grenade"],
    "Hive Scum": ["Blackout", "Boom Bringer", "Chem Grenade"],
  };

  const keystones = {
    "Veteran": ["Marksman's Focus", "Focus Target!", "Weapon Specialist"],
    "Zealot": ["Blazing Piety", "Martyrdom", "Inexorable Judgement"],
    "Psyker": ["Warp Siphon", "Empowered Psionics", "Disrupt Destiny"],
    "Ogryn": ["Heavy Hitter", "Feel No Pain", "Burst Limiter Override"],
    "Arbitrator": ["Execution Order", "Terminus Warrant", "Forceful"],
    "Hive Scum": ["Vulture's Mark", "Adrendaline Frenzy", "Chemical Dependency"],
  };

  const randomizeClass = () => {
    return getRandomItem(darktideData.classes);
  };

  const randomizeWeapons = (className) => {
    return {
      primary: darktideData.primaryWeapons[className]
        ? getRandomItem(darktideData.primaryWeapons[className])
        : "No weapon",
      secondary: darktideData.secondaryWeapons[className]
        ? getRandomItem(darktideData.secondaryWeapons[className])
        : "No weapon"
    };
  };

  const randomizeAbilities = (className) => {
    return {
      ability: combatAbilities[className] ? getRandomItem(combatAbilities[className]) : "None",
      blitz: blitzAbilities[className] ? getRandomItem(blitzAbilities[className]) : "None",
      keystone: keystones[className] ? getRandomItem(keystones[className]) : "None"
    };
  };

  const randomizeAll = () => {
    const randomClass = randomizeClass();
    const weapons = randomizeWeapons(randomClass.name);
    const abilities = randomizeAbilities(randomClass.name);

    const newLoadout = {
      class: randomClass,
      primary: weapons.primary,
      secondary: weapons.secondary,
      ability: abilities.ability,
      blitz: abilities.blitz,
      keystone: abilities.keystone
    };

    setLoadout(newLoadout);

    // Add to history
    const historyEntry = {
      ...newLoadout,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setHistory(prev => [historyEntry, ...prev.slice(0, 17)]);
  };

  const copyLoadout = () => {
    const text = `
Class: ${loadout.class?.name || 'None'}
Primary: ${loadout.primary || 'None'}
Secondary: ${loadout.secondary || 'None'}
Ability: ${loadout.ability || 'None'}
Blitz: ${loadout.blitz || 'None'}
Keystone: ${loadout.keystone || 'None'}
    `.trim();

    navigator.clipboard.writeText(text)
      .then(() => alert('Copied to clipboard'))
      .catch(() => alert('Failed to copy'));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="app">
      {/* GIF Popup Modal */}
      {showGif && (
        <div className="gif-modal" onClick={handleGifClose}>
          <div className="gif-content" onClick={(e) => e.stopPropagation()}>
            <button className="gif-close" onClick={handleGifClose}></button>
            <img 
              src={gifUrl} 
              alt="rawr" 
              className="easter-egg-gif"
            />
            <p className="gif-message">(Theres supposed to be a cute gif here but I couldn't figure out how to embed it correctly lmao)</p>
          </div>
        </div>
      )}
      <div className="header">
        <h1>Darktide Randomizer v1.0</h1>
        <p>For when you REALLY want a challenge for your games. Find a build that works... or not.</p>
      </div>

      <div className="main-content">
        {/* Horizontal Loadout Display */}
        <div className="loadout-row">
          <div className="loadout-item">
            <div className="item-label">CLASS</div>
            <div className="item-value" style={{ color: loadout.class?.color || '#888' }}>
              {loadout.class?.name || "—"}
            </div>
          </div>

          <div className="loadout-item">
            <div className="item-label">MELEE WEAPON</div>
            <div className="item-value">
              {loadout.primary || "—"}
            </div>
          </div>

          <div className="loadout-item">
            <div className="item-label">RANGE WEAPON</div>
            <div className="item-value">
              {loadout.secondary || "—"}
            </div>
          </div>

          <div className="loadout-item">
            <div className="item-label">COMBAT ABILITY</div>
            <div className="item-value">
              {loadout.ability || "—"}
            </div>
          </div>

          <div className="loadout-item">
            <div className="item-label">BLITZ</div>
            <div className="item-value">
              {loadout.blitz || "—"}
            </div>
          </div>

          <div className="loadout-item">
            <div className="item-label">KEYSTONE</div>
            <div className="item-value">
              {loadout.keystone || "—"}
            </div>
          </div>
        </div>

        {/* Control Buttons - Horizontal */}
        <div className="control-row">
          <button onClick={randomizeAll} className="control-button primary">
            Randomize All
          </button>
          <button onClick={copyLoadout} className="control-button">
            Copy Loadout
          </button>
        </div>

        {/* History - Minimal Horizontal */}
        <div className="history-section">
          <div className="history-header">
            <span>RECENT</span>
            {history.length > 0 && (
              <button onClick={clearHistory} className="clear-button">
                Clear
              </button>
            )}
          </div>

          <div className="history-row">
            {history.length > 0 ? (
              history.map((entry, index) => (
                <div key={index} className="history-item">
                  <div className="history-class" style={{ color: entry.class?.color }}>
                    {entry.class?.name.split(':')[0]}
                  </div>
                  <div className="history-weapons">
                    {entry.primary} / {entry.secondary} / {entry.ability} / {entry.blitz} / {entry.keystone}
                  </div>
                  <div className="history-time">{entry.timestamp}</div>
                </div>
              ))
            ) : (
              <div className="no-history">No recent loadouts</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="footer">
        <p>
          Made with love by{' '}
          <span
            className="monsoon-link"
            onClick={handleMonsoonificationClick}
            title="Glorp glorp I'm a fish"
          >
            @monsoonification
          </span>
        </p>
        <div className="social-icons">
          <a
            href="https://twitch.tv/monsoonification"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="Twitch"
          >
            <FaTwitch />
          </a>
          <a
            href="https://www.youtube.com/@monsoonify"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="YouTube"
          >
            <FaYoutube />
          </a>
        </div>
        <p className="disclaimer">Not affiliated with Fatshark or Games Workshop.</p>
      </div>
    </div>
  );
}

export default App;
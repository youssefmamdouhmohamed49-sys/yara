/**
 * Youssef & Hanan - Romantic Web Experience 💕
 * Designed & Coded with Love
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // AUDIO SYNTHESIZER (No external sound files needed!)
    // ==========================================
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playTone(freq, type = 'sine', duration = 0.2, gainValue = 0.15) {
        try {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Audio context policy fallback
        }
    }

    function playChime() {
        playTone(523.25, 'triangle', 0.25, 0.12); // C5
        setTimeout(() => playTone(659.25, 'triangle', 0.25, 0.12), 120); // E5
        setTimeout(() => playTone(783.99, 'triangle', 0.4, 0.15), 240); // G5
    }

    function playGiggleTone() {
        playTone(400, 'sine', 0.1, 0.1);
        setTimeout(() => playTone(600, 'sine', 0.12, 0.1), 100);
        setTimeout(() => playTone(800, 'sine', 0.15, 0.15), 200);
    }

    // ==========================================
    // 1. FLOATING HEARTS PARTICLES IN BACKGROUND
    // ==========================================
    const particleContainer = document.getElementById('particle-container');
    const heartSymbols = ['💖', '💕', '🌸', '✨', '💗', '💙', '🕊️'];

    function spawnHeart() {
        if (!particleContainer) return;
        const heart = document.createElement('div');
        heart.className = 'floating-heart-particle';
        heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 95 + '%';
        heart.style.fontSize = Math.floor(Math.random() * 18 + 14) + 'px';
        const duration = Math.random() * 4 + 5;
        heart.style.animationDuration = duration + 's';
        particleContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    // Spawn continuous soft background hearts
    setInterval(spawnHeart, 600);


    // ==========================================
    // 2. ESCAPING BUTTON LOGIC ("بحب يوسف") & TONGUE POP
    // ==========================================
    const btnRunAway = document.getElementById('btnRunAway');
    const playground = document.getElementById('playground');
    const escapeCounterHint = document.getElementById('escapeCounterHint');

    let escapeCount = 0;
    const teasingPhrases = [
        "مش هتعرفي تدوسي 😜",
        "أنا أسرع منك يا يويو 🏃‍♂️💨",
        "هاتيها لو تقدري! 😂",
        "بحب يوسف برضو بس اجري ورايا 💨",
        "دوسي على التاني اللي بينور أحسنلك 🤭",
        "مفيش فايدة زرار شقي زيك! 💃",
        "قربتي بس لسه مجبتنيش 😝",
        "الزرار التاني مستنيكي تنوريه 💡💕"
    ];

    const tongueIcons = ['😜', '😝', '😋', '🤪'];

    // Function to spawn the playful tongue-out emoji
    function spawnTongueEmoji(x, y) {
        const emoji = document.createElement('div');
        emoji.className = 'tongue-pop-emoji';
        emoji.innerText = tongueIcons[Math.floor(Math.random() * tongueIcons.length)];
        
        // Position at touch/click coordinates or center of button
        emoji.style.left = `${x}px`;
        emoji.style.top = `${y}px`;

        document.body.appendChild(emoji);

        setTimeout(() => {
            emoji.remove();
        }, 900);
    }

    function evade(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Playful sound tone
        playTone(380 + Math.random() * 220, 'sawtooth', 0.12, 0.1);

        // Get coordinates of the button before it moves for the tongue pop
        const btnRect = btnRunAway.getBoundingClientRect();
        const popX = btnRect.left + btnRect.width / 2;
        const popY = btnRect.top + btnRect.height / 2;
        spawnTongueEmoji(popX, popY);

        // Temporarily change button icon to tongue out
        const iconSpan = btnRunAway.querySelector('.btn-icon');
        if (iconSpan) {
            const oldIcon = iconSpan.innerText;
            iconSpan.innerText = '😜';
            setTimeout(() => {
                iconSpan.innerText = oldIcon;
            }, 400);
        }

        escapeCount++;
        if (escapeCounterHint) {
            const phrase = teasingPhrases[escapeCount % teasingPhrases.length];
            escapeCounterHint.innerHTML = `<span style="color: var(--primary-pink-deep); font-weight: 700;">${phrase}</span>`;
        }

        // Bounding within the phone playground container so it NEVER leaves the phone screen
        if (playground) {
            const playRect = playground.getBoundingClientRect();
            const btnWidth = btnRunAway.offsetWidth || 220;
            const btnHeight = btnRunAway.offsetHeight || 50;

            btnRunAway.style.position = 'absolute';

            const minX = 8;
            const maxX = Math.max(8, playRect.width - btnWidth - 8);
            
            // Safe height range inside the playground box
            const minY = 8;
            const maxY = Math.max(8, playRect.height - btnHeight - 65); // Leave room for bottom button

            const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

            btnRunAway.style.left = `${randomX}px`;
            btnRunAway.style.top = `${randomY}px`;
            btnRunAway.style.transform = `scale(0.96) rotate(${Math.floor(Math.random() * 14 - 7)}deg)`;
            
            setTimeout(() => {
                btnRunAway.style.transform = 'scale(1) rotate(0deg)';
            }, 250);
        }
    }

    if (btnRunAway) {
        // Desktop interaction
        btnRunAway.addEventListener('mouseenter', evade);
        btnRunAway.addEventListener('click', evade);

        // Mobile touch interaction (fires every tap and touch!)
        btnRunAway.addEventListener('touchstart', evade, { passive: false });
        btnRunAway.addEventListener('pointerdown', evade, { passive: false });
    }


    // ==========================================
    // 3. "مش بحب يوسف" -> FUNNY MODAL
    // ==========================================
    const btnNoLove = document.getElementById('btnNoLove');
    const funnyModal = document.getElementById('funnyModal');
    const btnForceLove = document.getElementById('btnForceLove');
    const stageTrap = document.getElementById('stage-trap');
    const stageHub = document.getElementById('stage-hub');

    if (btnNoLove && funnyModal) {
        btnNoLove.addEventListener('click', () => {
            playGiggleTone();
            funnyModal.classList.remove('hidden');
            
            // Light confetti burst
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 40,
                    spread: 60,
                    origin: { y: 0.6 }
                });
            }
        });
    }

    if (btnForceLove && funnyModal && stageTrap && stageHub) {
        btnForceLove.addEventListener('click', () => {
            playChime();
            funnyModal.classList.add('hidden');
            
            // Smooth transition from Stage 1 to Stage 2
            stageTrap.classList.remove('active');
            stageHub.classList.add('active');

            // Reset escaping button position
            if (btnRunAway) {
                btnRunAway.style.position = 'relative';
                btnRunAway.style.left = 'auto';
                btnRunAway.style.top = 'auto';
                btnRunAway.style.transform = 'none';
            }

            // Romantic Grand Confetti Explosion!
            if (typeof confetti === 'function') {
                const duration = 2.5 * 1000;
                const end = Date.now() + duration;

                (function frame() {
                    confetti({
                        particleCount: 5,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: ['#FF6584', '#70D6FF', '#FFD166', '#FFFFFF']
                    });
                    confetti({
                        particleCount: 5,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: ['#FF6584', '#70D6FF', '#FFD166', '#FFFFFF']
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                }());
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ==========================================
    // 4. HUB TAB NAVIGATION
    // ==========================================
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabPanels = document.querySelectorAll('.tab-panel');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            playTone(480, 'sine', 0.1, 0.08);

            const targetId = tab.getAttribute('data-target');

            navTabs.forEach(t => t.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });


    // ==========================================
    // 5. GIFT BOX & AMR DIAB SONG (EMERGES UPWARDS)
    // ==========================================
    const giftBoxBtn = document.getElementById('giftBoxBtn');
    const giftBox3D = document.getElementById('giftBox3D');
    const songContainer = document.getElementById('songContainer');
    const giftHintPill = document.getElementById('giftHintPill');

    if (giftBoxBtn && giftBox3D && songContainer) {
        giftBoxBtn.addEventListener('click', () => {
            playChime();
            const willOpen = !giftBox3D.classList.contains('opened');
            giftBox3D.classList.toggle('opened');

            if (willOpen) {
                // Show container with upward emergence animation
                songContainer.classList.remove('hidden');
                songContainer.style.animation = 'none';
                void songContainer.offsetWidth; // Trigger reflow
                songContainer.style.animation = '';

                if (giftHintPill) {
                    giftHintPill.innerText = 'اضغطي لقفل العلبة 🎀';
                }
                
                // Confetti shooting upwards like music and magic from the box!
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 85,
                        angle: 90,
                        spread: 85,
                        origin: { y: 0.75 },
                        colors: ['#FF6584', '#FFD166', '#70D6FF', '#FFFFFF']
                    });
                }

                // Smoothly bring the emerging song into view
                setTimeout(() => {
                    songContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 150);

            } else {
                songContainer.classList.add('hidden');
                if (giftHintPill) {
                    giftHintPill.innerText = 'اضغطي هنا لفتح الهدية ✨';
                }
            }
        });
    }


    // ==========================================
    // 6. NICKNAMES ACCORDION (يوسف بيقول إيه)
    // ==========================================
    const nicknameCards = document.querySelectorAll('.nickname-card');

    nicknameCards.forEach(card => {
        card.addEventListener('click', () => {
            playTone(520, 'triangle', 0.18, 0.1);
            
            // Toggle current card
            const isExpanded = card.classList.contains('expanded');
            
            // Close other cards for neat accordion style
            nicknameCards.forEach(c => c.classList.remove('expanded'));

            if (!isExpanded) {
                card.classList.add('expanded');
                
                // Mini heart pop above clicked card
                const rect = card.getBoundingClientRect();
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 15,
                        spread: 40,
                        origin: {
                            x: (rect.left + rect.width / 2) / window.innerWidth,
                            y: (rect.top + rect.height / 2) / window.innerHeight
                        },
                        colors: ['#FF6584', '#70D6FF']
                    });
                }
            }
        });
    });


    // ==========================================
    // 7. HANAN'S MESSAGE & WHATSAPP INTEGRATION
    // ==========================================
    const placeholderOverlay = document.getElementById('placeholderOverlay');
    const hananMessageInput = document.getElementById('hananMessageInput');
    const btnSendWhatsApp = document.getElementById('btnSendWhatsApp');
    const scatteredHearts = document.getElementById('scatteredHearts');
    const quickPills = document.querySelectorAll('.quick-pill');

    const YOUSSEF_PHONE = "201013371490"; // International format for +20 10 13371490

    // Populate scattered hearts in the message tab background
    if (scatteredHearts) {
        for (let i = 0; i < 18; i++) {
            const h = document.createElement('div');
            h.className = 'scattered-heart';
            h.innerText = heartSymbols[i % heartSymbols.length];
            h.style.top = Math.random() * 90 + '%';
            h.style.left = Math.random() * 90 + '%';
            h.style.animationDelay = (Math.random() * 3) + 's';
            scatteredHearts.appendChild(h);
        }
    }

    // Dynamic placeholder behavior
    if (hananMessageInput && placeholderOverlay) {
        // Hide placeholder when typing or focused with text
        hananMessageInput.addEventListener('focus', () => {
            placeholderOverlay.classList.add('hidden');
        });

        hananMessageInput.addEventListener('blur', () => {
            if (hananMessageInput.value.trim() === '') {
                placeholderOverlay.classList.remove('hidden');
            }
        });

        hananMessageInput.addEventListener('input', () => {
            const val = hananMessageInput.value.trim();
            if (val.length > 0) {
                placeholderOverlay.classList.add('hidden');
                btnSendWhatsApp.classList.remove('disabled');
                btnSendWhatsApp.removeAttribute('disabled');
            } else {
                btnSendWhatsApp.classList.add('disabled');
                btnSendWhatsApp.setAttribute('disabled', 'true');
            }
        });
    }

    // Quick tag pills: clicking appends to textarea
    quickPills.forEach(pill => {
        pill.addEventListener('click', () => {
            playTone(600, 'sine', 0.12, 0.08);
            const textToAdd = pill.innerText;
            if (hananMessageInput) {
                if (hananMessageInput.value.trim().length > 0) {
                    hananMessageInput.value += ' ' + textToAdd;
                } else {
                    hananMessageInput.value = textToAdd;
                }
                placeholderOverlay.classList.add('hidden');
                btnSendWhatsApp.classList.remove('disabled');
                btnSendWhatsApp.removeAttribute('disabled');
                hananMessageInput.focus();
            }
        });
    });

    // Send to WhatsApp
    if (btnSendWhatsApp && hananMessageInput) {
        btnSendWhatsApp.addEventListener('click', () => {
            const message = hananMessageInput.value.trim();
            if (!message) return;

            playChime();

            // Festive confetti
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 60,
                    spread: 80,
                    origin: { y: 0.8 },
                    colors: ['#25D366', '#FF6584', '#70D6FF']
                });
            }

            // WhatsApp Web & App URL (Uses api.whatsapp.com to prevent Unicode emoji corruption)
            const HEART_EMOJI = "\u2764\uFE0F";
            const TWO_HEARTS_EMOJI = "\uD83D\uDC95";
            const fullLoveMessage = `رسالة من حبيبتك يارا إلى يوسف ${HEART_EMOJI}:\n\n"${message}"\n\n(مرسلة بكل حب من موقعنا الخاص ${TWO_HEARTS_EMOJI})`;
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${YOUSSEF_PHONE}&text=${encodeURIComponent(fullLoveMessage)}`;

            setTimeout(() => {
                window.open(whatsappUrl, '_blank') || (window.location.href = whatsappUrl);
            }, 300);
        });
    }

});


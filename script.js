let trust = 0;
let resources = 10;
let food = 10;

const scenes = {
  startScreen: document.getElementById('start-screen'),
  chapter1: document.getElementById('chapter1'),
  chapter2: document.getElementById('chapter2'),
  chapter2Attack: document.getElementById('chapter2-attack'),
  chapter2ClinicDestroyed: document.getElementById('chapter2-clinic_destroyed'),
  chapter2Negotiation: document.getElementById('chapter2-negotiation'),
  chapter3: document.getElementById('chapter3'),
  chapter3Evidence: document.getElementById('chapter3-evidence'),
  chapter3Silence: document.getElementById('chapter3-silence'),
  ending: document.getElementById('ending')
};

const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const learnMoreButton = document.getElementById('learn-more-button');
const endingText = document.getElementById('ending-text');
const backgroundMusic = document.getElementById('background-music');

const startText = document.getElementById('start-text');
const chapter1Text = document.getElementById('chapter1-text');
const chapter2Text = document.getElementById('chapter2-text');
const chapter3Text = document.getElementById('chapter3-text');

// Status Meters
const trustMeter = document.getElementById('trust-meter');
const resourcesMeter = document.getElementById('resources-meter');
const foodMeter = document.getElementById('food-meter');

// Sound Controls
const muteButton = document.getElementById('mute-button');
const volumeSlider = document.getElementById('volume-slider');
let muted = false;

// Progress Indicators
const chapterMarkers = document.querySelectorAll('.chapter-marker');

// Audio Elements
const ambientRefugee = document.getElementById('ambient-refugee');
const ambientClinic = document.getElementById('ambient-clinic');
const ambientSurvivor = document.getElementById('ambient-survivor');
const sceneTransitionSound = document.getElementById('scene-transition-sound');
const statChangeSound = document.getElementById('stat-change-sound');
const typingSound = new Audio('audio/typing_sound.mp3');
const buttonClickSound = new Audio('audio/button_click.mp3');

// Set initial volume for audio elements
function setInitialVolume() {
  const initialVolume = volumeSlider.value;
  backgroundMusic.volume = initialVolume * 0.4; // Lower music volume
  ambientRefugee.volume = initialVolume * 0.2;
  ambientClinic.volume = initialVolume * 0.2;
  ambientSurvivor.volume = initialVolume * 0.2;
  sceneTransitionSound.volume = initialVolume * 0.6;
  typingSound.volume = initialVolume * 0.3;
  buttonClickSound.volume = initialVolume * 0.5;
  statChangeSound.volume = initialVolume * 0.6;
}

// Update all audio volumes when slider changes
volumeSlider.addEventListener('input', () => {
  if (!muted) {
    setInitialVolume();
  }
});

// Mute/unmute toggle
muteButton.addEventListener('click', () => {
  muted = !muted;
  
  if (muted) {
    muteButton.textContent = '🔇';
    backgroundMusic.volume = 0;
    ambientRefugee.volume = 0;
    ambientClinic.volume = 0;
    ambientSurvivor.volume = 0;
    sceneTransitionSound.volume = 0;
    typingSound.volume = 0;
    buttonClickSound.volume = 0;
    statChangeSound.volume = 0;
  } else {
    muteButton.textContent = '🔊';
    setInitialVolume();
  }
});

// Update meters
function updateMeters() {
  const maxTrust = 10;
  const maxResources = 15;
  const maxFood = 15;
  
  const trustPercentage = Math.min(Math.max((trust + 5) / maxTrust * 100, 0), 100); // Trust starts at -5 to +5 range
  const resourcesPercentage = Math.min(Math.max(resources / maxResources * 100, 0), 100);
  const foodPercentage = Math.min(Math.max(food / maxFood * 100, 0), 100);
  
  trustMeter.style.width = trustPercentage + '%';
  resourcesMeter.style.width = resourcesPercentage + '%';
  foodMeter.style.width = foodPercentage + '%';
  
  // Update colors based on values
  if (trustPercentage < 30) {
    trustMeter.style.backgroundColor = '#ff4d4d'; // red
  } else if (trustPercentage < 60) {
    trustMeter.style.backgroundColor = '#ffcc00'; // yellow
  } else {
    trustMeter.style.backgroundColor = '#66cc66'; // green
  }
  
  if (resourcesPercentage < 30) {
    resourcesMeter.style.backgroundColor = '#ff4d4d'; // red
  } else if (resourcesPercentage < 60) {
    resourcesMeter.style.backgroundColor = '#ffcc00'; // yellow
  } else {
    resourcesMeter.style.backgroundColor = '#66cc66'; // green
  }
  
  if (foodPercentage < 30) {
    foodMeter.style.backgroundColor = '#ff4d4d'; // red
  } else if (foodPercentage < 60) {
    foodMeter.style.backgroundColor = '#ffcc00'; // yellow
  } else {
    foodMeter.style.backgroundColor = '#66cc66'; // green
  }
}

// Update progress indicator
function updateProgressIndicator(currentScene) {
  chapterMarkers.forEach(marker => {
    marker.classList.remove('active');
    marker.classList.remove('completed');
  });
  
  let currentFound = false;
  
  chapterMarkers.forEach(marker => {
    const chapter = marker.getAttribute('data-chapter');
    
    if (chapter === currentScene) {
      marker.classList.add('active');
      currentFound = true;
    } else if (!currentFound) {
      marker.classList.add('completed');
    }
  });
}

// Show feedback notification for choices
function showFeedback(element, trustChange, resourcesChange, foodChange) {
  let feedbackText = '';
  
  if (trustChange !== 0) {
    feedbackText += `Trust: ${trustChange > 0 ? '+' : ''}${trustChange} `;
  }
  
  if (resourcesChange !== 0) {
    feedbackText += `Resources: ${resourcesChange > 0 ? '+' : ''}${resourcesChange} `;
  }
  
  if (foodChange !== 0) {
    feedbackText += `Food: ${foodChange > 0 ? '+' : ''}${foodChange}`;
  }
  
  if (feedbackText) {
    const notification = document.getElementById(element);
    notification.textContent = feedbackText;
    notification.classList.remove('hidden');
    
    // Play stat change sound
    if (!muted) {
      statChangeSound.currentTime = 0;
      statChangeSound.play();
    }
    
    // Show notification with animation
    notification.classList.add('show-feedback');
    
    // Hide after animation
    setTimeout(() => {
      notification.classList.remove('show-feedback');
      notification.classList.add('hide-feedback');
      
      setTimeout(() => {
        notification.classList.add('hidden');
        notification.classList.remove('hide-feedback');
      }, 500);
    }, 2000);
  }
}

// Text to display
const texts = {
  start: "Eastern DRC has endured decades of conflict. Since 2021, the M23 rebel group has intensified attacks on civilians. As a UN peacekeeper, your choices will save lives—or escalate violence.",
  chapter1: "Local Elder: 'The rebels took our crops. We've had no aid in weeks. My grandchildren are starving.'\nUN Officer (Radio): 'Warning: M23 is near. Trucks with supplies are delayed. Prioritize who gets the little food we have.'",
  chapter2: "Villager: 'They killed my husband! Help us!'\nM23 Commander (Radio Intercept): 'Leave, or we burn the clinic next.'",
  chapter3: "Survivor: 'They made us watch... They said anyone who talks dies.'\nUN Legal Advisor: 'Documenting war crimes risks retaliation. But evidence could trigger ICC action.'"
};

// Start the game
startButton.addEventListener('click', () => {
  scenes.startScreen.classList.add('hidden');
  scenes.chapter1.classList.remove('hidden');
  updateProgressIndicator('chapter1');
  
  // Show status bar when game starts
  document.getElementById('status-bar').style.display = 'flex';
  
  backgroundMusic.play();
  playAmbientSound('chapter1');
  typeText(chapter1Text, texts.chapter1);
  updateMeters();
  setInitialVolume();
});

// Handle choices
document.querySelectorAll('.choices button').forEach(button => {
  button.addEventListener('click', (event) => {
    if (!muted) {
      buttonClickSound.currentTime = 0; // Reset sound to start
      buttonClickSound.play();
    }

    const trustChange = parseInt(event.target.getAttribute('data-trust') || 0);
    const resourcesChange = parseInt(event.target.getAttribute('data-resources') || 0);
    const foodChange = parseInt(event.target.getAttribute('data-food') || 0);
    const branch = event.target.getAttribute('data-branch') || 'standard';

    trust += trustChange;
    resources += resourcesChange;
    food += foodChange;
    
    updateMeters();

    // Get current scene
    const currentScene = Array.from(document.querySelectorAll('.scene')).find(scene => !scene.classList.contains('hidden'));
    
    // Chapter 1 branches
    if (currentScene === scenes.chapter1) {
      showFeedback('choice-feedback', trustChange, resourcesChange, foodChange);
      
      setTimeout(() => {
        if (branch === 'refugee_camp' || branch === 'silence') {
          transitionToScene(scenes.chapter2);
          updateProgressIndicator('chapter2');
          playAmbientSound('chapter2');
          typeText(chapter2Text, texts.chapter2);
        }
      }, 2000);
    }
    
    // Chapter 2 branches
    else if (currentScene === scenes.chapter2) {
      showFeedback('choice-feedback-ch2', trustChange, resourcesChange, foodChange);
      
      setTimeout(() => {
        if (branch === 'attack') {
          transitionToScene(scenes.chapter2Attack);
          updateProgressIndicator('chapter2');
          playAmbientSound('chapter2');
        } else if (branch === 'clinic_destroyed') {
          transitionToScene(scenes.chapter2ClinicDestroyed);
          updateProgressIndicator('chapter2');
          playAmbientSound('chapter2');
        } else if (branch === 'negotiation') {
          transitionToScene(scenes.chapter2Negotiation);
          updateProgressIndicator('chapter2');
          playAmbientSound('chapter2');
        }
      }, 2000);
    }
    
    // Chapter 2 branch scenes to Chapter 3
    else if (currentScene === scenes.chapter2Attack || 
             currentScene === scenes.chapter2ClinicDestroyed || 
             currentScene === scenes.chapter2Negotiation) {
      
      const feedbackId = currentScene === scenes.chapter2Attack ? 'choice-feedback-ch2-attack' : 
                         currentScene === scenes.chapter2ClinicDestroyed ? 'choice-feedback-ch2-clinic' : 
                         'choice-feedback-ch2-negotiation';
                         
      showFeedback(feedbackId, trustChange, resourcesChange, foodChange);
      
      setTimeout(() => {
        transitionToScene(scenes.chapter3);
        updateProgressIndicator('chapter3');
        playAmbientSound('chapter3');
        typeText(chapter3Text, texts.chapter3);
      }, 2000);
    }
    
    // Chapter 3 branches
    else if (currentScene === scenes.chapter3) {
      showFeedback('choice-feedback-ch3', trustChange, resourcesChange, foodChange);
      
      setTimeout(() => {
        if (branch === 'evidence') {
          transitionToScene(scenes.chapter3Evidence);
          updateProgressIndicator('chapter3');
          playAmbientSound('chapter3');
        } else if (branch === 'silence') {
          transitionToScene(scenes.chapter3Silence);
          updateProgressIndicator('chapter3');
          playAmbientSound('chapter3');
        }
      }, 2000);
    }
    
    // Chapter 3 branch scenes to Ending
    else if (currentScene === scenes.chapter3Evidence || 
             currentScene === scenes.chapter3Silence) {
      
      const feedbackId = currentScene === scenes.chapter3Evidence ? 'choice-feedback-ch3-evidence' : 
                         'choice-feedback-ch3-silence';
                         
      showFeedback(feedbackId, trustChange, resourcesChange, foodChange);
      
      setTimeout(() => {
        transitionToScene(scenes.ending);
        updateProgressIndicator('ending');
        showEnding();
      }, 2000);
    }
  });
});

// Show ending based on trust and resources
function showEnding() {
  if (trust >= 3 && resources >= 5) {
    endingText.textContent = "Heroic Ending: Your courage and wisdom saved countless lives. The world applauds your efforts, but the war is far from over.";
  } else if (trust >= 0 && resources >= 3) {
    endingText.textContent = "Pragmatic Ending: You made tough choices, but many survived because of you. The mission continues, but hope remains.";
  } else {
    endingText.textContent = "Failed Ending: The mission is labeled a failure. Violence spreads, and the world looks away. You wonder: was any choice right?";
  }
}

// Restart the game
restartButton.addEventListener('click', () => {
  trust = 0;
  resources = 10;
  food = 10;
  scenes.ending.classList.add('hidden');
  scenes.startScreen.classList.remove('hidden');
  
  // Hide status bar on restart
  document.getElementById('status-bar').style.display = 'none';
  
  updateProgressIndicator('start');
  typeText(startText, texts.start);
  updateMeters();
  
  // Stop all ambient sounds
  ambientRefugee.pause();
  ambientClinic.pause();
  ambientSurvivor.pause();
  ambientRefugee.currentTime = 0;
  ambientClinic.currentTime = 0;
  ambientSurvivor.currentTime = 0;
});

// Learn More button
learnMoreButton.addEventListener('click', () => {
  window.location.href = 'war_info.html';
});

// Play ambient sounds for each scene
function playAmbientSound(scene) {
  // Stop all ambient sounds
  ambientRefugee.pause();
  ambientClinic.pause();
  ambientSurvivor.pause();

  // Play the appropriate sound
  if (scene === 'chapter1') {
    ambientRefugee.play();
  } else if (scene === 'chapter2') {
    ambientClinic.play();
  } else if (scene === 'chapter3') {
    ambientSurvivor.play();
  }
}

// Scene transition with enhanced fade and slide effect
function transitionToScene(newScene) {
  const currentScene = document.querySelector('.scene:not(.hidden)');
  currentScene.classList.add('fade-slide-out');
  
  if (!muted) {
    sceneTransitionSound.currentTime = 0; // Reset sound
    sceneTransitionSound.play();
  }
  
  setTimeout(() => {
    currentScene.classList.add('hidden');
    currentScene.classList.remove('fade-slide-out');
    newScene.classList.remove('hidden');
    newScene.classList.add('fade-slide-in');
    
    setTimeout(() => {
      newScene.classList.remove('fade-slide-in');
    }, 1000);
  }, 1000); // 1-second fade
}

// Play transition sound
function playTransitionSound() {
  if (!muted) {
    sceneTransitionSound.currentTime = 0; // Reset sound
    sceneTransitionSound.play();
  }
}

// Type text letter by letter
function typeText(element, text, speed = 50) {
  let index = 0;
  element.textContent = "";

  // Start typing sound loop
  if (!muted) {
    typingSound.loop = true; // Loop the typing sound
    typingSound.play();
  }

  const typingInterval = setInterval(() => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
    } else {
      clearInterval(typingInterval);
      typingSound.pause(); // Stop typing sound when done
      typingSound.currentTime = 0; // Reset sound to start
    }
  }, speed);
}

// Initialize start screen text
typeText(startText, texts.start);

// Initialize meters on page load
updateMeters();
updateProgressIndicator('start');
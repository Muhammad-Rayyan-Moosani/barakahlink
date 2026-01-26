import React, { useState, useEffect, useRef } from 'react';
import { SMSMessage, FoodDrop } from '../types';

/**
 * Props interface for the SMSView component.
 * 
 * @interface SMSViewProps
 */
interface SMSViewProps {
  /**
   * Array of all food drop listings available on the platform.
   * Used to respond to SMS queries about available food.
   */
  drops: FoodDrop[];
}

/**
 * SMS chat interface component simulating mobile messaging interaction.
 * 
 * Provides a realistic mobile phone interface that simulates SMS-based
 * interaction with the BarakahLink platform. Designed to demonstrate how
 * users without smartphone apps can access food listings via text message.
 * 
 * Key Features:
 * - Realistic iPhone-style mobile interface with hardware details
 * - Interactive chat interface with send/receive messaging
 * - Automated responses to user queries about food availability
 * - Typing indicator for natural conversation flow
 * - Auto-scrolling to latest messages
 * - Command recognition system ("FOOD", postal codes)
 * - Formatted responses with emojis for readability
 * - Real-time filtering of available food drops
 * 
 * Supported Commands:
 * - "FOOD": Lists all available food drops in the area
 * - Postal codes (3+ characters): Location-based food search
 * - Invalid commands: Helpful error message with usage instructions
 * 
 * Response Format:
 * For each available food drop, displays:
 * - Title with numbered list
 * - Location (address and city) with 📍 emoji
 * - Quantity with 📦 emoji
 * - Dietary tags with 🏷️ emoji
 * - AI-generated summary with ℹ️ emoji
 * 
 * UI Design:
 * - Phone chassis with realistic bezels and notch
 * - Chat bubbles with different colors for user vs system
 * - Smooth animations for new messages
 * - Backdrop blur effects for modern iOS aesthetic
 * - Rounded corners and shadows throughout
 * 
 * User Experience:
 * - Enter key support for quick message sending
 * - Auto-scroll keeps latest messages visible
 * - Typing indicator shows processing state
 * - 1.5s delay simulates real network latency
 * - Clear visual distinction between sent/received messages
 * 
 * Accessibility Features:
 * - High contrast text on message bubbles
 * - Readable font sizes (14px for content)
 * - Clear timestamp formatting
 * - Emoji for visual information hierarchy
 * 
 * @component
 * @example
 * ```tsx
 * <SMSView drops={availableFoodDrops} />
 * ```
 * 
 * @remarks
 * This component is primarily for demonstration and educational purposes,
 * showing how BarakahLink could support SMS-based access for users without
 * smartphone apps. In production, would integrate with actual SMS gateway.
 */
export const SMSView: React.FC<SMSViewProps> = ({ drops }) => {
  /**
   * State management for chat messages.
   * Initialized with a welcome message from the system.
   * 
   * Initial Message:
   * - Welcomes user to BarakahLink
   * - Explains geographic coverage (Kitchener-Waterloo)
   * - Provides usage instructions
   */
  const [messages, setMessages] = useState<SMSMessage[]>([
    {
      id: '1',
      from: 'System',
      content: 'Welcome to BarakahLink. Providing community food support in Kitchener-Waterloo.\n\nText "FOOD" or your postal code to see what is available nearby.',
      timestamp: new Date()
    }
  ]);

  /**
   * Current input text in the message field.
   * Bound to controlled input component.
   */
  const [input, setInput] = useState('');

  /**
   * Boolean indicating if the system is "typing" a response.
   * Used to show typing indicator animation while processing user query.
   */
  const [isTyping, setIsTyping] = useState(false);

  /**
   * Reference to the scrollable messages container.
   * Used to programmatically scroll to bottom when new messages arrive.
   */
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * Auto-scroll effect for messages container.
   * 
   * Triggers when:
   * - New messages are added to the array
   * - Typing indicator state changes
   * 
   * Behavior:
   * Smoothly scrolls the messages container to show the latest content,
   * ensuring users always see the most recent message or typing indicator.
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  /**
   * Handles sending a user message and generating system response.
   * 
   * Process Flow:
   * 1. Validates input is not empty
   * 2. Creates user message object and adds to messages array
   * 3. Clears input field
   * 4. Shows typing indicator
   * 5. Simulates network delay (1.5s)
   * 6. Processes command and generates appropriate response
   * 7. Hides typing indicator and adds system response
   * 
   * Command Processing:
   * - "FOOD" or 3+ characters: Lists available food drops
   * - Unknown commands: Returns help message
   * 
   * Response Generation:
   * - Filters drops to only show 'available' status
   * - Formats each drop with emojis and structured information
   * - Includes all relevant details (title, location, quantity, tags, summary)
   * - Provides link to full map interface
   * - Shows "no results" message when appropriate
   */
  const handleSend = () => {
    // Validate input is not empty or whitespace-only
    if (!input.trim()) return;

    /**
     * Create user message object.
     * Uses current timestamp as unique ID (simplified for demo).
     */
    const userMsg: SMSMessage = {
      id: Date.now().toString(),
      from: 'You',
      content: input,
      timestamp: new Date()
    };

    // Add user message to conversation
    setMessages(prev => [...prev, userMsg]);

    // Clear input field for next message
    setInput('');

    // Show typing indicator
    setIsTyping(true);

    /**
     * Simulate SMS gateway processing delay.
     * 
     * In production, this would be replaced with actual API call
     * to SMS processing service. The 1.5s delay creates realistic
     * network latency for demonstration purposes.
     */
    setTimeout(() => {
      setIsTyping(false);
      let reply = '';

      // Normalize command for case-insensitive matching
      const cmd = input.toUpperCase().trim();

      // Filter to only available food drops
      const availableDrops = drops.filter(d => d.status === 'available');

      /**
       * Command Recognition and Response Generation
       * 
       * Conditions:
       * - Contains "FOOD" keyword
       * - OR is 3+ characters (postal code pattern)
       */
      if (cmd.includes('FOOD') || cmd.length >= 3) {
        if (availableDrops.length > 0) {
          // Build formatted response listing all available drops
          reply = `🍽️ Found ${availableDrops.length} food listing${availableDrops.length > 1 ? 's' : ''} available:\n\n`;

          /**
           * Format each food drop with comprehensive information.
           * 
           * Information Hierarchy:
           * 1. Numbered title for easy reference
           * 2. Location (essential for pickup)
           * 3. Quantity (helps plan transportation)
           * 4. Dietary tags (critical for dietary restrictions)
           * 5. AI summary (quick understanding)
           */
          availableDrops.forEach((drop, index) => {
            reply += `${index + 1}. ${drop.title}\n`;
            reply += `📍 ${drop.pickupAddress}, ${drop.city}\n`;
            reply += `📦 ${drop.quantity}\n`;

            // Only include tags if present
            if (drop.tags.length > 0) {
              reply += `🏷️ ${drop.tags.join(', ')}\n`;
            }

            // Only include AI summary if available
            if (drop.aiSummary) {
              reply += `ℹ️ ${drop.aiSummary}\n`;
            }

            // Add spacing between listings
            reply += `\n`;
          });

          /**
           * Append call-to-action directing users to full map interface.
           * Provides path for users to reserve food and see more details.
           */
          reply += `\nTo reserve, visit: barakahlink.app/map`;
        } else {
          /**
           * No results response.
           * Acknowledges search but provides helpful follow-up message
           * about future notifications (demonstrates potential feature).
           */
          reply = `No active food listings were found in your area right now.\n\nWe will notify you if a new donation becomes available nearby.`;
        }
      } else {
        /**
         * Unknown command response.
         * Provides helpful guidance on correct usage.
         */
        reply = 'Unknown command. Text "FOOD" to see what is available.';
      }

      /**
       * Add system response to conversation.
       * Increments timestamp by 1ms to ensure unique ID.
       */
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        from: 'System',
        content: reply,
        timestamp: new Date()
      }]);
    }, 1500);
  };

  return (
    /**
     * Mobile Phone Chassis Container
     * 
     * Design:
     * - Realistic iPhone dimensions (360px width, 720px height)
     * - Dark slate background simulating phone body
     * - Heavy border radius (3.5rem) for modern phone shape
     * - Border simulating phone bezel
     * - Multi-layered shadow for depth
     * - Subtle hover scale for interactive polish
     * - Centered in viewport with auto margins
     * 
     * Structure:
     * Uses flexbox column layout to organize phone elements vertically.
     */
    <div className="max-w-[360px] mx-auto bg-slate-950 rounded-[3.5rem] p-4 shadow-[0_50px_100px_-20px_rgba(6,78,59,0.5)] border-[10px] border-slate-900 overflow-hidden h-[720px] flex flex-col relative group transition-transform hover:scale-[1.01] duration-700">
      {/* 
        Phone Hardware: Notch/Dynamic Island
        
        Simulates iPhone notch at top of screen.
        - Positioned absolutely at top center
        - Dark background matching phone chassis
        - Rounded bottom corners
        - Contains speaker/sensor bar representation
        - Z-index 20 to appear above screen content
      */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-slate-900 rounded-b-3xl z-20 flex justify-center items-start pt-1">
        <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
      </div>

      {/* 
        Screen Container
        
        Main area displaying the chat interface.
        - Takes remaining space after hardware elements
        - Light background simulating iOS interface
        - Rounded corners matching phone screen
        - Padding to accommodate notch and home indicator
        - Flexbox column for organizing chat sections
      */}
      <div className="flex-1 overflow-hidden pt-10 pb-4 bg-[#f4f7f5] rounded-[2.5rem] flex flex-col relative">
        {/* 
          Chat Header
          
          Shows conversation information and branding.
          - Fixed at top of screen
          - Glassmorphic effect with backdrop blur
          - Brand icon (circular with "B" initial)
          - Service name and status indicator
          - Border separation from messages
        */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center space-x-4">
          {/* Brand Avatar Icon */}
          <div className="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center text-amber-400 font-black shadow-lg">
            <span className="serif text-xl">B</span>
          </div>

          {/* Service Info */}
          <div>
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
              BarakahLink Support
            </h4>
            {/* Status Indicator */}
            <div className="flex items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                Official Gateway
              </span>
            </div>
          </div>
        </div>

        {/* 
          Messages List Container
          
          Scrollable area containing all chat messages.
          - Takes remaining vertical space
          - Scrollable when content exceeds height
          - Hidden scrollbar for clean appearance
          - Padding for comfortable reading
          - Vertical spacing between messages
        */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-6 no-scrollbar">
          {/* 
            Date Separator
            Displays current date in iOS style.
          */}
          <div className="text-center mb-8">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] bg-white px-4 py-1 rounded-full border border-slate-100">
              Today
            </span>
          </div>

          {/* 
            Message Bubbles
            
            Iterates through messages array to render each message.
            - Different alignment for user vs system messages
            - Fade-in and slide-up animation on appearance
            - Responsive max-width for readability
          */}
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.from === 'You' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
            >
              {/**
               * Message Bubble
               * 
               * Styling varies based on sender:
               * - User messages: Emerald background, right-aligned, notch on bottom-right
               * - System messages: White background, left-aligned, notch on bottom-left
               * 
               * Content:
               * - Message text with pre-wrap for line breaks
               * - Timestamp in small text at bottom
               */}
              <div className={`max-w-[85%] px-5 py-4 rounded-3xl text-[14px] leading-relaxed shadow-sm transition-all ${msg.from === 'You'
                  ? 'bg-emerald-700 text-white rounded-br-none font-medium'
                  : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/50 font-medium'
                }`}>
                {/* Message Content - preserves whitespace and line breaks */}
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Timestamp */}
                <p className={`text-[10px] mt-2 font-bold uppercase tracking-wider ${msg.from === 'You' ? 'text-emerald-200/60' : 'text-slate-300'
                  }`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* 
            Typing Indicator
            
            Shows when system is processing a response.
            - Only visible when isTyping is true
            - Animated dots bouncing in sequence
            - Styled like incoming message bubble
            - Smooth fade-in animation
          */}
          {isTyping && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="bg-white px-5 py-4 rounded-3xl rounded-bl-none border border-slate-200/50 flex space-x-1.5 items-center h-10">
                {/* Three animated dots with staggered delays */}
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* 
          Input Area
          
          Fixed at bottom of screen for message composition.
          - Glassmorphic background with blur
          - Rounded pill-shaped input container
          - Text input field with placeholder
          - Send button with icon
          - Ring effect for depth
        */}
        <div className="px-4 pb-4 pt-2 bg-white/50 backdrop-blur-sm">
          <div className="bg-white p-2 rounded-full border border-slate-200 shadow-xl flex items-center ring-4 ring-emerald-900/5">
            {/* 
              Text Input Field
              - Transparent background to show container
              - No outline on focus
              - Placeholder text in light gray
              - Enter key triggers send
              - Controlled component bound to input state
            */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message"
              className="flex-1 bg-transparent px-5 py-3 text-[14px] focus:outline-none placeholder:text-slate-300 font-semibold text-slate-900"
            />

            {/* 
              Send Button
              - Circular button with emerald background
              - Paper plane icon indicating send action
              - Hover darkens background
              - Active state scales down for tactile feedback
              - Large touch target for mobile usability
            */}
            <button
              onClick={handleSend}
              className="bg-emerald-800 text-amber-400 p-3.5 rounded-full hover:bg-emerald-900 transition-all shadow-lg active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 
        Phone Hardware: Home Indicator
        
        Simulates iPhone home indicator bar.
        - Fixed at bottom of phone
        - Centered horizontally
        - Rounded pill shape
        - Semi-transparent appearance
      */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-28 h-1.5 bg-slate-800 rounded-full opacity-40"></div>
    </div>
  );
};
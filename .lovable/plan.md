
# Order Center Page Mein "Track" Tab Add Karna

## Masla Kya Hai?
Aap Order Center page (`/order-center`) mein ek naya "Track" tab add karna chahte hain. Jab user is tab par click kare to:
1. Ek search input dikhaye jahan user apna Order ID ya Transaction ID paste kar sake
2. Search karne par order ki poori details aur status show ho
3. Ye feature login ke baghair bhi kaam kare - koi bhi user apna order track kar sake

## Kya Changes Honge?

### 1. TabType Mein "Track" Option Add Karna
```
Purana: 'all' | 'to_pay' | 'completed' | 'cancelled'
Naya:   'all' | 'to_pay' | 'completed' | 'cancelled' | 'track'
```

### 2. Naye State Variables
- `searchTransactionId` - Order ID store karne ke liye
- `searchResult` - Search result store karne ke liye
- `searchLoading` - Loading state ke liye
- `searchError` - Error message ke liye
- `hasSearched` - Track karne ke liye ke search ki gayi ya nahi

### 3. Search Function
RefundStatusPage se `handleTransactionSearch` function copy karenge jo:
- Pehle Order ID (UUID format) se search kare
- Agar na mile to Transaction ID se search kare
- Bina login ke bhi kaam kare
- Order ki poori details show kare

### 4. UI Changes
- Tabs mein "Track" button add hoga (Cancelled ke baad)
- "Track" tab select karne par:
  - Search input field dikhega
  - Search button hoga
  - Result card dikhega jo status show karega (Pending/Completed/Cancelled/Failed)
  - Order ki poori information (Player ID, Price, Date, etc.)

## Visual Layout (Track Tab)

```text
┌─────────────────────────────────────────────────┐
│  ORDER RECORD                                    │
├─────────────────────────────────────────────────┤
│  [All] [To Pay] [Completed] [Cancelled] [Track] │
├─────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐    │
│  │ Search Order by Order ID                │    │
│  │ ┌─────────────────────────┐ ┌────────┐  │    │
│  │ │ Enter Order ID...      🔍 │ │ Search │  │    │
│  │ └─────────────────────────┘ └────────┘  │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  ┌─────────────────────────────────────────┐    │
│  │ ✓ Order Found                           │    │
│  │ ─────────────────────────────────────── │    │
│  │ Package: 2250 UC                        │    │
│  │ Player ID: 52210077772                  │    │
│  │ Price: Rs. 4500                         │    │
│  │ Date: 27 Jan 2026                       │    │
│  │ Status: ✓ Completed                     │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

## Technical Section

### File Changes:
**`src/pages/OrderCenterPage.tsx`**

1. **Imports add karna:**
   - `Search, X, Loader2` lucide-react se
   - `Input` aur `Button` components
   - `formatOrderPrice` utility

2. **TabType update:**
   ```typescript
   type TabType = 'all' | 'to_pay' | 'completed' | 'cancelled' | 'track';
   ```

3. **Naye states:**
   ```typescript
   const [searchTransactionId, setSearchTransactionId] = useState('');
   const [searchResult, setSearchResult] = useState<OrderItem | null>(null);
   const [searchLoading, setSearchLoading] = useState(false);
   const [searchError, setSearchError] = useState<string | null>(null);
   const [hasSearched, setHasSearched] = useState(false);
   ```

4. **Search function add karna:**
   ```typescript
   const handleTransactionSearch = async () => {
     // UUID check karna
     // Order ID se search
     // Transaction ID se search
     // Result set karna
   };
   ```

5. **Tabs array mein "Track" add:**
   ```typescript
   { key: 'track', label: 'Track' }
   ```

6. **UI rendering:**
   - Agar `activeTab === 'track'` to search UI dikhana
   - Warna orders list dikhana

### Search Result Card:
- Green border agar completed
- Yellow border agar pending
- Red border agar cancelled/failed
- Status icon with color
- Order details display

### Important Points:
- Login require nahi hogi - koi bhi user track kar sakta hai
- Same styling jo Order Center page mein hai
- Mobile responsive design
- Smooth animations with framer-motion

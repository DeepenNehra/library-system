import { useState, useEffect } from 'react'
import axios from 'axios'
// 'Navigate' ko import kiya hai redirect karne ke liye
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { BookOpen, History, Library, PlusCircle, User, Calendar, CheckCircle, Clock, Search } from 'lucide-react'

// --- COMPONENT 1: NAVBAR ---
const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    // Ab hum check karenge ki kya path '/inventory' hai
    return location.pathname === path 
      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
      : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600";
  }

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Library<span className="text-indigo-600">System</span>
          </h1>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-full">
          {/* Link ko '/' se badal kar '/inventory' kar diya */}
          <Link to="/inventory" className={`px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all duration-300 ${isActive('/inventory')}`}>
            <Library className="w-4 h-4" />
            Inventory
          </Link>
          <Link to="/history" className={`px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all duration-300 ${isActive('/history')}`}>
            <History className="w-4 h-4" />
            History
          </Link>
        </div>
      </div>
    </nav>
  )
}

// --- COMPONENT 2: INVENTORY PAGE ---
const InventoryPage = ({ books, fetchData }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")

  const handleAddBook = (e) => {
    e.preventDefault()
    if(!title || !author) return alert("Fill all fields")
    axios.post('http://127.0.0.1:8000/api/books/', { title, author, is_borrowed: false })
      .then(() => { fetchData(); setTitle(""); setAuthor("") })
  }

  const handleCheckout = (bookId) => {
    const borrower = prompt("Enter Borrower Name:")
    if (borrower) {
      axios.post(`http://127.0.0.1:8000/api/books/${bookId}/checkout/`, { borrower_name: borrower })
      .then(() => fetchData())
    }
  }

  const handleReturn = (bookId) => {
    axios.post(`http://127.0.0.1:8000/api/books/${bookId}/return_book/`)
    .then(() => fetchData())
  }

  const availableBooks = books.filter(book => !book.is_borrowed)
  const borrowedBooks = books.filter(book => book.is_borrowed)

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12 animate-fade-in">
      
      {/* Add Book Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1 rounded-3xl shadow-xl shadow-indigo-100">
        <div className="bg-white p-8 rounded-[22px]">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-indigo-600" />
            Add New Book
          </h3>
          <form onSubmit={handleAddBook} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <BookOpen className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-indigo-500 transition-colors" />
              <input type="text" placeholder="Book Title" value={title} onChange={e=>setTitle(e.target.value)} 
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
            </div>
            <div className="flex-1 relative group">
              <User className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-indigo-500 transition-colors" />
              <input type="text" placeholder="Author Name" value={author} onChange={e=>setAuthor(e.target.value)} 
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
            </div>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Add Book
            </button>
          </form>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-12">
        {/* Available Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Available Books <span className="text-slate-400 text-lg font-normal">({availableBooks.length})</span></h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableBooks.map((book) => (
              <div key={book.id} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-2xl"></div>
                <div className="mb-6">
                  <h4 className="font-bold text-lg text-slate-800 line-clamp-1 mb-1 group-hover:text-emerald-700 transition-colors">{book.title}</h4>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <User className="w-3 h-3" /> {book.author}
                  </p>
                </div>
                <button onClick={() => handleCheckout(book.id)} className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all">
                  Checkout
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Borrowed Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Borrowed Books <span className="text-slate-400 text-lg font-normal">({borrowedBooks.length})</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {borrowedBooks.map((book) => (
              <div key={book.id} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-200 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 rounded-l-2xl"></div>
                <div className="mb-6">
                  <h4 className="font-bold text-lg text-slate-800 line-clamp-1 mb-1 group-hover:text-orange-700 transition-colors">{book.title}</h4>
                  <p className="text-sm text-slate-500 mb-3">{book.author}</p>
                  <div className="inline-flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                    <User className="w-3.5 h-3.5 text-orange-600" />
                    <span className="text-xs font-bold text-orange-700">{book.borrower_name}</span>
                  </div>
                </div>
                <button onClick={() => handleReturn(book.id)} className="w-full py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:border-orange-200 hover:text-orange-600 hover:bg-orange-50 transition-all">
                  Return Book
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- COMPONENT 3: HISTORY PAGE ---
const HistoryPage = ({ records }) => {
  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      <div className="bg-white rounded-[24px] shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <History className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Transaction History</h3>
              <p className="text-slate-500">Complete record of library activity</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <Search className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Total Records: {records.length}</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-6 pl-8">Book Details</th>
                <th className="p-6">Borrower</th>
                <th className="p-6">Timeline</th>
                <th className="p-6 pr-8">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length === 0 ? (
                  <tr><td colSpan="4" className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
                    <History className="w-10 h-10 opacity-20" />
                    No history available yet.
                  </td></tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="p-6 pl-8">
                      <div className="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">{rec.book_title}</div>
                      <div className="text-xs text-slate-400">ID: #{rec.id}</div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center text-sm font-bold border border-white shadow-sm">
                          {rec.borrower_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-600">{rec.borrower_name}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 w-fit px-3 py-1 rounded-lg border border-slate-100">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{rec.due_date}</span>
                      </div>
                    </td>
                    <td className="p-6 pr-8">
                      {rec.is_returned ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                          <CheckCircle className="w-3.5 h-3.5" /> Returned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                          <Clock className="w-3.5 h-3.5" /> Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// --- MAIN APP ---
function App() {
  const [books, setBooks] = useState([])
  const [records, setRecords] = useState([])

  const fetchData = () => {
    axios.get('http://127.0.0.1:8000/api/books/').then(res => setBooks(res.data)).catch(err => console.error(err))
    axios.get('http://127.0.0.1:8000/api/records/').then(res => {
        const sorted = res.data.sort((a, b) => Number(a.is_returned) - Number(b.is_returned));
        setRecords(sorted)
    }).catch(err => console.error(err))
  }

  useEffect(() => { fetchData() }, [])

  return (
    <Router>
      <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-100">
        <Navbar />
        <div className="py-8">
          <Routes>
            {/* Redirect / to /inventory */}
            <Route path="/" element={<Navigate to="/inventory" replace />} />
            
            {/* Naya route path */}
            <Route path="/inventory" element={<InventoryPage books={books} fetchData={fetchData} />} />
            <Route path="/history" element={<HistoryPage records={records} />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
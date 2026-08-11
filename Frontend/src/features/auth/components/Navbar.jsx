import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Navbar = () => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()

    const onLogout = async () => {
        try {
            await handleLogout()
            toast.success("Logged out successfully")
            navigate('/login')
        } catch (err) {
            toast.error("Failed to logout. Please try again.")
        }
    }

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 32px',
            backgroundColor: '#12151c',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            flexWrap: 'wrap',
            gap: '12px'
        }}>
            <div style={{
                fontWeight: 'bold',
                fontSize: '18px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
            }}>
                <span style={{ color: '#e11d5e' }}>Prep</span>Wise AI
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#fff',
                    fontSize: '14px'
                }}>
                    <div style={{
                        width: '34px',
                        height: '34px',
                        minWidth: '34px',
                        borderRadius: '50%',
                        backgroundColor: '#e11d5e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '15px'
                    }}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span style={{ fontWeight: '500', whiteSpace: 'nowrap' }}>
                        {user?.name || 'User'}
                    </span>
                </div>

                <button
                    onClick={onLogout}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '6px',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'background-color 0.2s',
                        whiteSpace: 'nowrap'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Navbar
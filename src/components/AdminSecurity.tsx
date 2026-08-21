import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  Key,
  Shield,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Save,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface AdminSecurityProps {
  isDarkMode: boolean;
  adminToken: string;
  getAuthHeaders: (extra?: Record<string, string>) => Record<string, string>;
  onPasswordChanged?: (newToken?: string) => void;
}

export const AdminSecurity: React.FC<AdminSecurityProps> = ({
  isDarkMode,
  getAuthHeaders,
  onPasswordChanged,
}) => {
  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [changeLoading, setChangeLoading] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState('');
  const [changeError, setChangeError] = useState('');

  // Security Settings State
  const [recoveryPin, setRecoveryPin] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetchSecurityInfo();
  }, []);

  const fetchSecurityInfo = async () => {
    try {
      const res = await fetch('/api/admin/security-info');
      if (res.ok) {
        const data = await res.json();
        if (data.securityQuestion) {
          setSecurityQuestion(data.securityQuestion);
        }
        if (data.updatedAt) {
          setLastUpdated(data.updatedAt);
        }
      }
    } catch (err) {
      console.error('Failed to fetch security info:', err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');
    setChangeSuccess('');

    if (newPassword.length < 4) {
      setChangeError('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangeError('New passwords do not match. Please re-type accurately.');
      return;
    }

    setChangeLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setChangeSuccess(data.message || 'Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        if (data.token && onPasswordChanged) {
          onPasswordChanged(data.token);
        }
        fetchSecurityInfo();
      } else {
        setChangeError(data.error || 'Failed to update password. Check your current password.');
      }
    } catch (err) {
      setChangeError('Network error while changing password.');
    } finally {
      setChangeLoading(false);
    }
  };

  const handleSaveSecuritySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    if (!recoveryPin.trim() && !securityQuestion.trim() && !securityAnswer.trim()) {
      setSettingsError('Please provide at least a Recovery PIN or Security Answer.');
      return;
    }

    setSettingsLoading(true);
    try {
      const res = await fetch('/api/admin/security-settings', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          recoveryPin: recoveryPin.trim() || undefined,
          securityQuestion: securityQuestion.trim() || undefined,
          securityAnswer: securityAnswer.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSettingsSuccess(data.message || 'Security recovery settings updated!');
        setRecoveryPin('');
        setSecurityAnswer('');
        fetchSecurityInfo();
      } else {
        setSettingsError(data.error || 'Failed to update recovery settings.');
      }
    } catch (err) {
      setSettingsError('Network error updating security settings.');
    } finally {
      setSettingsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/40">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#1D9BB5]" />
            Admin Security & Password Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Update your admin login credentials and configure emergency recovery keys to prevent lockout.
          </p>
        </div>

        {lastUpdated && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Last Updated: {new Date(lastUpdated).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CARD 1: CHANGE ADMIN PASSWORD */}
        <div
          className={`p-6 rounded-3xl border shadow-lg space-y-6 ${
            isDarkMode ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D9BB5]/10 text-[#1D9BB5] border border-[#1D9BB5]/20 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Change Admin Password</h3>
              <p className="text-xs text-slate-400">Set a new login password for the admin console</p>
            </div>
          </div>

          {changeSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{changeSuccess}</span>
            </motion.div>
          )}

          {changeError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{changeError}</span>
            </motion.div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                Current Password (Optional if authenticated)
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password..."
                  className={`w-full pl-4 pr-10 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#1D9BB5] ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                New Admin Password
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 4 characters)..."
                  className={`w-full pl-4 pr-10 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#1D9BB5] ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password..."
                  className={`w-full pl-4 pr-10 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#1D9BB5] ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={changeLoading}
              className="w-full glow-btn text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {changeLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{changeLoading ? 'Updating Password...' : 'Save New Password'}</span>
            </button>
          </form>
        </div>

        {/* CARD 2: RECOVERY & LOCKOUT PREVENTION SETTINGS */}
        <div
          className={`p-6 rounded-3xl border shadow-lg space-y-6 ${
            isDarkMode ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Emergency Recovery Settings</h3>
              <p className="text-xs text-slate-400">Configure how you can reset your password if forgotten</p>
            </div>
          </div>

          {settingsSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{settingsSuccess}</span>
            </motion.div>
          )}

          {settingsError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{settingsError}</span>
            </motion.div>
          )}

          <form onSubmit={handleSaveSecuritySettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                Custom Recovery PIN / Master Key
              </label>
              <input
                type="text"
                value={recoveryPin}
                onChange={(e) => setRecoveryPin(e.target.value)}
                placeholder="e.g. PB86 or UG-8686 (Default is PB86)"
                className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#1D9BB5] ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                A secret PIN you can type on the login screen to instantly reset the password.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                Security Question
              </label>
              <input
                type="text"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                placeholder="e.g. What is our Pioneer Mall shop room number?"
                className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#1D9BB5] ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                Security Secret Answer
              </label>
              <input
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="e.g. PB86 (Case-insensitive)"
                className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#1D9BB5] ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={settingsLoading}
              className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all ${
                isDarkMode
                  ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-white'
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
              }`}
            >
              {settingsLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-[#1D9BB5]" />
              )}
              <span>{settingsLoading ? 'Saving Settings...' : 'Update Recovery Configuration'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Security Best Practices Card */}
      <div
        className={`p-6 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1D9BB5]/10 text-[#1D9BB5] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Automated Master Recovery Guaranteed</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              If you ever forget your password, click &quot;Forgot Password?&quot; on the login page and use Pioneer Mall Shop Code <span className="font-mono font-bold text-[#1D9BB5]">PB86</span> or your custom PIN to create a new one instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import fs from 'fs';
let code = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const target = `                                {/* Social Links with additions */}
                                <div className="space-y-4 pt-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-primary shrink-0" style={{color: '#054d44'}}>`;

const replacement = `                                {/* Social Links with additions */}
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-3 bg-surface-container-low p-3 border border-outline-variant/10 relative">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-primary shrink-0" style={{color: '#054d44'}}>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/DemoDashboard.tsx', code);

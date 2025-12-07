import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar/Sidebar";
import { Navbar } from "./Navbar/Navbar";
import { useState } from "react";
import { cn } from "@/utils/tailwind";


const ProtectedLayout = () => {
   const [isCollapsed, setIsCollapsed] = useState(false);
    
    return (
      <div className="min-h-screen bg-background">
        <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
        <Navbar isCollapsed={isCollapsed} />
  
        <main 
          className={cn(
            'pt-16 transition-all duration-300',
            isCollapsed ? 'ml-16' : 'ml-64'
          )}
        >
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    );
};

export default ProtectedLayout;

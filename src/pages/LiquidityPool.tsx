import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Droplets, Info, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { validateWalletAddress } from '../utils/inputValidation';
import { createRaydiumUrl, openSecureUrl } from '../utils/urlSecurity';
import { createUserFriendlyError } from '../utils/errorHandling';

const LiquidityPool = () => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [solAmount, setSolAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [validationError, setValidationError] = useState('');
  const { toast } = useToast();

  const handleTokenAddressChange = (value: string) => {
    setTokenAddress(value);
    
    // Validate wallet address format
    if (value) {
      const validation = validateWalletAddress(value);
      setValidationError(validation.isValid ? '' : validation.error!);
    } else {
      setValidationError('');
    }
  };

  const openRaydium = () => {
    if (!tokenAddress) {
      toast({
        title: "Token Address Required",
        description: "Please enter a valid token mint address first",
        variant: "destructive"
      });
      return;
    }

    // Validate token address before creating URL
    const validation = validateWalletAddress(tokenAddress);
    if (!validation.isValid) {
      toast({
        title: "Invalid Token Address",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }
    
    try {
      const raydiumUrl = createRaydiumUrl(tokenAddress, 'devnet'); // Default to devnet for safety
      const success = openSecureUrl(
        raydiumUrl, 
        "Open Raydium to create a liquidity pool for your token?"
      );
      
      if (!success) {
        toast({
          title: "Security Block",
          description: "The link was blocked for security reasons",
          variant: "destructive"
        });
      }
    } catch (error) {
      const userFriendlyError = createUserFriendlyError(error, 'validation');
      toast({
        title: "Invalid Input",
        description: userFriendlyError,
        variant: "destructive"
      });
    }
  };

  const handleExternalLink = (url: string, confirmMessage: string) => {
    const success = openSecureUrl(url, confirmMessage);
    if (!success) {
      toast({
        title: "Blocked",
        description: "This link has been blocked for security reasons",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-blue-500/10"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:text-purple-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Generator
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Liquidity Pool Creation</h1>
            <p className="text-purple-200">Add liquidity to Raydium DEX</p>
          </div>
          
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Main Card with enhanced security */}
          <Card className="bg-black/20 backdrop-blur-lg border-purple-500/30 p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Create Liquidity Pool</h2>
                <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                  Raydium Integration
                </Badge>
              </div>

              {/* Token Address Input with Validation */}
              <div className="space-y-2">
                <label className="text-purple-200 text-sm font-medium">Token Mint Address</label>
                <Input
                  value={tokenAddress}
                  onChange={(e) => handleTokenAddressChange(e.target.value)}
                  placeholder="Enter your token's mint address (e.g., 11111111111111111111111111111112)"
                  className={`bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-purple-400 ${
                    validationError ? 'border-red-400' : ''
                  }`}
                />
                {validationError && (
                  <p className="text-red-400 text-xs">{validationError}</p>
                )}
                <p className="text-purple-300 text-xs">
                  This is the mint address you received when creating your token
                </p>
              </div>

              {/* Liquidity Amounts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-purple-200 text-sm font-medium">SOL Amount</label>
                  <Input
                    type="number"
                    value={solAmount}
                    onChange={(e) => setSolAmount(e.target.value)}
                    placeholder="0.0"
                    className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-purple-400"
                  />
                  <p className="text-purple-300 text-xs">Amount of SOL to add</p>
                </div>

                <div className="space-y-2">
                  <label className="text-purple-200 text-sm font-medium">Token Amount</label>
                  <Input
                    type="number"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    placeholder="0.0"
                    className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-purple-400"
                  />
                  <p className="text-purple-300 text-xs">Amount of tokens to add</p>
                </div>
              </div>

              {/* Secure Action Button */}
              <Button
                onClick={openRaydium}
                disabled={!tokenAddress || !!validationError}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 text-lg font-semibold"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Open in Raydium (Secure)
              </Button>
              
              {validationError && (
                <p className="text-center text-red-400 text-sm">
                  Please fix the token address before proceeding
                </p>
              )}
            </div>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-blue-500/10 border-blue-500/30 p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-blue-300 font-semibold mb-2">How it works</h3>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• Enter your token's mint address</li>
                    <li>• Click "Open in Raydium"</li>
                    <li>• Complete the pool creation on Raydium</li>
                    <li>• Add your initial liquidity</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="bg-orange-500/10 border-orange-500/30 p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-orange-300 font-semibold mb-2">Important Notes</h3>
                  <ul className="text-orange-200 text-sm space-y-1">
                    <li>• Pool creation requires SOL for fees</li>
                    <li>• You need both SOL and your tokens</li>
                    <li>• Price is determined by initial ratio</li>
                    <li>• Liquidity can be removed later</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Enhanced Raydium Info with Security Notice */}
          <Card className="bg-black/20 backdrop-blur-lg border-purple-500/30 p-4">
            <div className="text-center">
              <h3 className="text-white font-semibold mb-2">About Raydium</h3>
              <p className="text-purple-200 text-sm mb-3">
                Raydium is the leading automated market maker (AMM) and liquidity provider on Solana. 
                It provides faster trading, shared liquidity, and new features for earning yield.
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExternalLink('https://raydium.io/', 'Visit the official Raydium website?')}
                  className="text-purple-300 hover:text-purple-200"
                >
                  Visit Raydium
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
              <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                <p className="text-blue-200 text-xs">
                  🔒 All external links are validated for security and require confirmation
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiquidityPool;

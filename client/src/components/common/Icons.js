import React from 'react';
import { Sun, Wind, Battery, Settings, CheckCircle, Phone, Mail, MapPin, Clock, Menu, X, ChevronRight, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowRight, Zap, Shield, Award, Users } from 'lucide-react';

export { Sun, Wind, Battery, Settings, CheckCircle, Phone, Mail, MapPin, Clock, Menu, X, ChevronRight, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowRight, Zap, Shield, Award, Users };

export const Icon = ({ name, size = 24, color = 'currentColor' }) => {
  const icons = {
    sun: Sun,
    wind: Wind,
    battery: Battery,
    settings: Settings,
    check: CheckCircle,
    phone: Phone,
    mail: Mail,
    location: MapPin,
    clock: Clock,
    menu: Menu,
    close: X,
    arrow: ChevronRight,
    fb: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
    right: ArrowRight,
    zap: Zap,
    shield: Shield,
    award: Award,
    users: Users
  };
  const IconComponent = icons[name] || Sun;
  return <IconComponent size={size} color={color} />;
};

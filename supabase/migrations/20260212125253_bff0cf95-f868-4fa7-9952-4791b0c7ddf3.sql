
-- Role enum
CREATE TYPE public.app_role AS ENUM ('tenant', 'owner', 'admin');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public profiles viewable" ON public.profiles FOR SELECT USING (true);

-- User roles (separate table per security requirements)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  sector TEXT,
  city TEXT NOT NULL DEFAULT 'Chandigarh',
  price INTEGER NOT NULL,
  bhk INTEGER NOT NULL DEFAULT 1,
  furnished BOOLEAN DEFAULT false,
  parking BOOLEAN DEFAULT false,
  pets_allowed BOOLEAN DEFAULT false,
  bachelor_allowed BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved properties are public" ON public.properties FOR SELECT USING (status = 'approved');
CREATE POLICY "Owners can view own properties" ON public.properties FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners can insert properties" ON public.properties FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update own properties" ON public.properties FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete own properties" ON public.properties FOR DELETE USING (auth.uid() = owner_id);
CREATE POLICY "Admins can manage all properties" ON public.properties FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Saved properties (tenant stash)
CREATE TABLE public.saved_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved" ON public.saved_properties FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save properties" ON public.saved_properties FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave properties" ON public.saved_properties FOR DELETE USING (auth.uid() = user_id);

-- Inquiries
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'read', 'replied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants can view own inquiries" ON public.inquiries FOR SELECT USING (auth.uid() = tenant_id);
CREATE POLICY "Tenants can send inquiries" ON public.inquiries FOR INSERT WITH CHECK (auth.uid() = tenant_id);
CREATE POLICY "Owners can view inquiries for their properties" ON public.inquiries FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.properties WHERE properties.id = property_id AND properties.owner_id = auth.uid())
);
CREATE POLICY "Owners can update inquiry status" ON public.inquiries FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.properties WHERE properties.id = property_id AND properties.owner_id = auth.uid())
);

-- Auto-create profile + default tenant role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', ''));
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'tenant');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

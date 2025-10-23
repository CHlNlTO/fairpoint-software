-- Add policies to allow modifications to COA template items and rules
-- These policies ensure that COA template items and rules can be modified

-- Add policy to allow modifications to COA template items
alter policy "No modifications to COA template items"
on "public"."coa_template_items"
to public
using (true);

-- Add policy to allow modifications to COA template rules
alter policy "No modifications to COA template rules"
on "public"."coa_template_rules"
to public
using (true);

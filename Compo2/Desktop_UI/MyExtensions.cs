using MetroFramework;
using MetroFramework.Components;
using MetroFramework.Forms;
using System.ComponentModel;

namespace Desktop_UI
{
    public static class MyExtensions
    {
        private const MetroColorStyle FormStyle = MetroColorStyle.Orange;
        private const MetroThemeStyle ThemeStyle = MetroThemeStyle.Light;
        public static void SetStyle(this IContainer container, MetroForm ownerForm)
        {
            if (container == null)
            {
                container = new Container();
            }
            var manager = new MetroStyleManager(container);
            manager.Owner = ownerForm;
            container.SetDefaultStyle(ownerForm, FormStyle);
            container.SetDefaultTheme(ownerForm, ThemeStyle);
        }
        public static void SetDefaultStyle(this IContainer contr, MetroForm owner, MetroColorStyle style)
        {
            MetroStyleManager manager = FindManager(contr, owner);
            manager.Style = style;
            owner.Style = style;
        }
        public static void SetDefaultTheme(this IContainer contr, MetroForm owner, MetroThemeStyle thme)
        {
            MetroStyleManager manager = FindManager(contr, owner);
            manager.Theme = thme;
        }
        private static MetroStyleManager FindManager(IContainer contr, MetroForm owner)
        {
            MetroStyleManager manager = null;
            foreach (IComponent item in contr.Components)
            {
                if (((MetroStyleManager)item).Owner == owner)
                {
                    manager = (MetroStyleManager)item;
                }
            }
            return manager;
        }
    }
}

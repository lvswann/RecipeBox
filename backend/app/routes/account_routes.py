from flask import Blueprint, render_template, redirect, url_for
from flask_login import current_user, login_required,  logout_user


# Blueprint Configuration
bp = Blueprint(
    'main_bp', __name__,
    template_folder='templates',
    static_folder='static'
)


@bp.route("/logout")
@login_required
def logout():
    """User log-out logic."""
    logout_user()
    return redirect(url_for('auth_bp.login'))